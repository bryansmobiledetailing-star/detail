import express from "express";
import { getSquareClient, getSquareLocationId } from "./src/services/square.ts";
import { randomUUID } from "crypto";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";
import { SERVICES, CATEGORIES, VEHICLE_SIZES, SPECIALTY_SIZES, ADD_ONS } from "./src/data/services.ts";
import { syncServiceToSquare, deleteServiceFromSquare, autoCorrectCatalogDrift } from "./src/services/squareSyncEngine.ts";
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const db = getFirestore(firebaseConfig.firestoreDatabaseId);

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // BigInt serialization
  app.set('json replacer', (key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value
  );

  // Helper to get Square Client from request headers
  const getClientFromReq = (req: express.Request) => {
    const token = req.headers['x-square-access-token'] as string;
    return getSquareClient(token);
  };

  const getLocFromReq = (req: express.Request) => {
    const loc = req.headers['x-square-location-id'] as string;
    return getSquareLocationId(loc);
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SEO Routes
  app.get("/robots.txt", (req, res) => {
    const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: ${appUrl}/sitemap.xml`);
  });

  app.get("/sitemap.xml", (req, res) => {
    const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
    const categories = [
      'full-detailing', 
      'maintenance', 
      'interior-only', 
      'exterior-only', 
      'paint-correction', 
      'ceramic-coating', 
      'rv-motorhome'
    ];
    
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${appUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${appUrl}/services</loc><priority>0.8</priority></url>
  ${categories.map(slug => `<url><loc>${appUrl}/services/${slug}</loc><priority>0.7</priority></url>`).join('\n  ')}
  <url><loc>${appUrl}/gallery</loc><priority>0.7</priority></url>
  <url><loc>${appUrl}/membership</loc><priority>0.6</priority></url>
  <url><loc>${appUrl}/faq</loc><priority>0.5</priority></url>
  <url><loc>${appUrl}/quote</loc><priority>0.7</priority></url>
</urlset>`);
  });

  // Square Payment Processing
  app.post("/api/payments", async (req, res) => {
    const { sourceId, amount, customerId, bookingId, paymentIntentId } = req.body;

    try {
      const client = getClientFromReq(req) as any;

      // Stage 1: Create "Payment Intent" (Square Order) if no sourceId provided
      if (!sourceId) {
        console.log(`💳 Creating Payment Intent for Customer: ${customerId}, Amount: ${amount}`);
        const orderResponse = await client.orders.create({
          idempotencyKey: randomUUID(),
          order: {
            locationId: getLocFromReq(req),
            customerId,
            lineItems: [
              {
                name: `Deposit for Booking ${bookingId || 'New'}`,
                quantity: '1',
                basePriceMoney: {
                  amount: BigInt(amount),
                  currency: 'USD',
                },
              },
            ],
          },
        });

        // Return the Order ID as the "client_secret"
        return res.json({ 
          client_secret: orderResponse.order.id,
          id: orderResponse.order.id
        });
      }

      // Stage 2: Process the actual payment
      const response = await client.payments.create({
        sourceId,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(amount), // Amount in cents
          currency: 'USD',
        },
        customerId,
        orderId: paymentIntentId, // Link the payment to the "intent" (Order)
        note: `Payment for Booking ${bookingId}${paymentIntentId ? ` (Order: ${paymentIntentId})` : ''}`,
      });

      res.json(response.payment);
    } catch (error: any) {
      console.error("Square Payment Error:", error);
      res.status(500).json({ error: error.message || "Payment failed" });
    }
  });

  // Fetch Services from Square Catalog
  app.get("/api/catalog/services", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      
      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      
      do {
        const response: any = await catalog.list({ types: 'ITEM', cursor });
        if (response.objects) {
          objects = objects.concat(response.objects);
        }
        cursor = response.cursor;
      } while (cursor);

      // Filter for items that are services and map them
      const serviceMap = new Map();
      
      objects
        .filter((obj: any) => obj.itemData?.variations?.some((v: any) => v.itemVariationData?.serviceDuration))
        .forEach((obj: any) => {
          const name = obj.itemData?.name;
          const version = obj.version ? BigInt(obj.version) : 0n;
          
          if (!serviceMap.has(name) || version > serviceMap.get(name).version) {
            serviceMap.set(name, {
              id: obj.id,
              name: obj.itemData?.name,
              description: obj.itemData?.description,
              categoryId: obj.itemData?.categoryId,
              version: version,
              variations: obj.itemData?.variations?.map((v: any) => ({
                id: v.id,
                name: v.itemVariationData?.name,
                duration: v.itemVariationData?.serviceDuration,
                price: v.itemVariationData?.priceMoney?.amount ? Number(v.itemVariationData.priceMoney.amount) / 100 : 0,
              }))
            });
          }
        });

      res.json(Array.from(serviceMap.values()));
    } catch (error: any) {
      console.error("Square Catalog Error:", error);
      // Fallback to empty array if not configured
      res.json([]);
    }
  });

  // Square Availability API
  app.get("/api/availability", async (req, res) => {
    try {
      const { start, end, serviceVariationId } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required" });
      }

      const client = getClientFromReq(req) as any;
      const response = await client.bookings.searchAvailability({
        query: {
          filter: {
            startAtRange: {
              startAt: start as string,
              endAt: end as string,
            },
            locationId: getLocFromReq(req),
            segmentFilters: [
              {
                serviceVariationId: (serviceVariationId as string) || "ANY_SERVICE_VARIATION_ID",
              }
            ]
          }
        }
      });

      // Map Square availability to a simpler format for the frontend
      const availabilities = response.availabilities || [];
      res.json(availabilities);
    } catch (error: any) {
      console.error("Square Availability Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch availability" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { startAt, locationId, serviceVariationIds, customer } = req.body;
      
      const client = getClientFromReq(req) as any;

      // 1. Create or Find Customer
      let customerId;
      try {
        const searchResult = await client.customers.search({
          query: {
            filter: {
              emailAddress: {
                exact: customer.email
              }
            }
          }
        });

        const customers = searchResult.customers;
        if (customers && customers.length > 0) {
          customerId = customers[0].id;
        } else {
          const createResult = await client.customers.create({
            idempotencyKey: randomUUID(),
            givenName: customer.firstName,
            familyName: customer.lastName,
            emailAddress: customer.email,
            phoneNumber: customer.phone,
          });
          customerId = createResult.customer?.id;
        }
      } catch (e: any) {
        console.error("Customer Error:", e);
        throw new Error("Failed to create or find customer: " + e.message);
      }

      // 2. Create Booking
      const bookingResult = await client.bookings.create({
        idempotencyKey: randomUUID(),
        booking: {
          startAt,
          locationId: locationId || getLocFromReq(req),
          customerId,
          appointmentSegments: Array.isArray(serviceVariationIds) 
            ? serviceVariationIds.map(id => ({
                serviceVariationId: id,
                teamMemberId: "ANY",
              }))
            : [{ serviceVariationId: req.body.serviceVariationId, teamMemberId: "ANY" }]
        }
      });

      const { booking } = bookingResult;

      // 3. Send Confirmation Emails
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const formattedDate = new Date(startAt).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          // Customer Email
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: "Booking Confirmed - Bryan's Showroom Quality Detailing",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #111;">Booking Confirmed!</h2>
                <p>Hi ${customer.firstName},</p>
                <p>We've received your booking for <strong>${formattedDate}</strong>.</p>
                <p>A $50 non-refundable deposit is required to secure your appointment if you haven't paid it yet. We will contact you shortly with payment instructions or you can pay via the secure link sent in a separate message.</p>
                <p><strong>Appointment Details:</strong></p>
                <ul>
                  <li>Location: Bellevue Garage / Omaha Metro</li>
                  <li>Time: ${formattedDate}</li>
                </ul>
                <p>If you have any questions, feel free to call us at (712) 305-6313.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">Bryan's Showroom Quality Detailing</p>
              </div>
            `
          });

          // Admin Notification
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Booking: ${customer.firstName} ${customer.lastName}`,
            html: `
              <h2>New Appointment Scheduled</h2>
              <p><strong>Customer:</strong> ${customer.firstName} ${customer.lastName}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Phone:</strong> ${customer.phone}</p>
              <p><strong>Time:</strong> ${formattedDate}</p>
              <p><strong>Booking ID:</strong> ${booking.id}</p>
            `
          });
        } catch (emailErr) {
          console.error("Email Notification Error:", emailErr);
          // Don't fail the request if email fails
        }
      }

      res.json(booking);
    } catch (error: any) {
      console.error("Square Booking Error:", error);
      res.status(500).json({ error: error.message || "Failed to create booking" });
    }
  });

  // Admin Sync Endpoint
  app.post("/api/admin/sync-square", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog, teamMembers } = client;
      
      console.log('🚀 Starting Square Sync (V7 - Strictly Additive)...');

      // 1. Fetch EVERYTHING (No filters to be safe)
      let allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.list({ cursor });
        const objects = response.data || response.result?.objects || response.objects || [];
        allObjects = allObjects.concat(objects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => {
        return name.toLowerCase()
          .replace(/premium|essential|signature|standard|smoke|severe|entry|level\s*\d/g, '') // Strip prefixes and suffixes
          .replace(/[^a-z0-9]/g, '')
          .trim();
      };
      
      // Group items and categories by normalized name
      const existingItemsByNorm = new Map<string, any[]>();
      const existingCatsByNorm = new Map<string, any[]>();

      for (const obj of allObjects) {
        if (obj.isDeleted) continue;
        const name = (obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name || "");
        if (!name) continue;
        const norm = normalize(name);

        const group = obj.type === 'CATEGORY' ? existingCatsByNorm : existingItemsByNorm;
        if (!group.has(norm)) group.set(norm, []);
        group.get(norm)!.push(obj);
      }

      // Helper to cleanup duplicates and return the best ID
      const cleanupAndGetId = async (norm: string, type: 'CATEGORY' | 'ITEM') => {
        const group = type === 'CATEGORY' ? existingCatsByNorm : existingItemsByNorm;
        const matches = group.get(norm) || [];
        
        if (matches.length > 1) {
          console.log(`🧹 Found ${matches.length} duplicates for ${norm}. Keeping freshest...`);
          // Sort by version descending (keep freshest)
          matches.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const toDelete = matches.slice(1).map(m => m.id);
          // Delete in small batches
          for (let i = 0; i < toDelete.length; i += 50) {
            await catalog.batchDelete({ objectIds: toDelete.slice(i, i + 50) });
          }
          return matches[0].id;
        }
        
        return matches[0]?.id;
      };

      const teamMemberIds: string[] = [];
      try {
        const teamResult = await teamMembers.search({ query: { filter: { status: 'ACTIVE' } } });
        teamMemberIds.push(...(teamResult.teamMembers?.map((tm: any) => tm.id) || []));
      } catch (e) {
        console.warn("Team member fetch skipped:", e);
      }

      // 2. Sync Categories
      const categoryIdMap: Record<string, string> = { 'specialty-services': '' };
      for (const cat of CATEGORIES) {
        const norm = normalize(cat.name);
        const existingId = await cleanupAndGetId(norm, 'CATEGORY');
        
        const upsertRes = await catalog.object.upsert({
          idempotencyKey: `sync-cat-v10-${cat.id}`, // Constant key for this category
          object: {
            type: 'CATEGORY',
            id: existingId || `#${cat.id}`,
            categoryData: { name: cat.name },
          }
        });
        const finalId = upsertRes.catalogObject?.id;
        if (finalId) categoryIdMap[cat.id] = finalId;
      }

      // 3. Sync Services (Force Update All)
      let syncedCount = 0;

      for (const service of SERVICES) {
        const norm = normalize(service.name);
        const existingId = await cleanupAndGetId(norm, 'ITEM');
        
        let vduration = "60 min";
        if (typeof service.duration === "string") {
          vduration = service.duration;
        } else if (service.duration && typeof service.duration === "object") {
          vduration = service.duration.car || service.duration.rv || Object.values(service.duration)[0] || "60 min";
        }
        const durationMatch = vduration.match(/(\d+)(?:-(\d+))?\s*(hour|hr|min|day)/i);
        let durationMinutes = 60;
        if (durationMatch) {
          const v1 = parseInt(durationMatch[1]);
          const v2 = durationMatch[2] ? parseInt(durationMatch[2]) : v1;
          const unit = durationMatch[3].toLowerCase();
          const avg = (v1 + v2) / 2;
          
          if (unit.startsWith('d')) {
             durationMinutes = Math.round(avg * 24 * 60);
          } else if (unit.startsWith('h')) {
             durationMinutes = Math.round(avg * 60);
          } else {
             durationMinutes = Math.round(avg);
          }
        }

        const sizesToApply = service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES;
        const variations = sizesToApply.map(size => {
          const price = service.price[size.id];
          if (price === undefined) return null;

          return {
            type: 'ITEM_VARIATION',
            id: `#var-${service.id}-${size.id}`,
            itemVariationData: {
              name: size.name,
              pricingType: 'FIXED_PRICING',
              serviceDuration: BigInt(durationMinutes * 60 * 1000), // convert to milliseconds
              availableForBooking: true,
              priceMoney: {
                amount: BigInt(price * 100),
                currency: 'USD',
              },
              ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
            },
          };
        }).filter(Boolean);

        await catalog.object.upsert({
          idempotencyKey: `sync-svc-v10-${service.id}`, // Deterministic & Robust
          object: {
            type: 'ITEM',
            id: existingId || `#${service.id}`,
            itemData: {
              name: service.name,
              description: service.description,
              categoryId: categoryIdMap[service.categoryId],
              productType: 'APPOINTMENTS_SERVICE',
              variations: variations as any,
            },
          },
        });
        syncedCount++;
      }

      // 4. Sync Add-ons (Force Update All)
      for (const addon of ADD_ONS) {
        const norm = normalize(addon.name);
        const existingId = await cleanupAndGetId(norm, 'ITEM');
        
        const durationMatch = addon.duration.match(/(\d+)(?:-(\d+))?\s*(hour|hr|min)/i);
        let durationMinutes = 30;
        if (durationMatch) {
          const v1 = parseInt(durationMatch[1]);
          const v2 = durationMatch[2] ? parseInt(durationMatch[2]) : v1;
          const unit = durationMatch[3].toLowerCase();
          const avg = (v1 + v2) / 2;
          durationMinutes = Math.round(unit.startsWith('h') ? avg * 60 : avg);
        }

        await catalog.object.upsert({
          idempotencyKey: `sync-addon-v10-${addon.id}`,
          object: {
            type: 'ITEM',
            id: existingId || `#${addon.id}`,
            itemData: {
              name: addon.name,
              description: addon.description,
              categoryId: categoryIdMap['add-ons'],
              productType: 'APPOINTMENTS_SERVICE',
              variations: [{
                type: 'ITEM_VARIATION',
                id: `#var-${addon.id}`,
                itemVariationData: {
                  name: 'Standard',
                  pricingType: 'FIXED_PRICING',
                  serviceDuration: BigInt(durationMinutes * 60 * 1000), // convert to milliseconds
                  availableForBooking: true,
                  priceMoney: {
                    amount: BigInt(addon.price * 100),
                    currency: 'USD',
                  },
                  ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
                },
              }],
            },
          },
        });
        syncedCount++;
      }

      res.json({ 
        success: true, 
        message: `Sync Complete. Fully aligned ${syncedCount} items with Square catalog.` 
      });
    } catch (error: any) {
      console.error("Selective Sync Error:", error);
      res.status(500).json({ error: error.message || "Sync failed" });
    }
  });

  app.post("/api/admin/remove-all-duplicates", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      console.log('🧹 Nuclear Cleanup: Identifying all duplicates...');

      let allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.list({ types: 'CATEGORY,ITEM', cursor });
        const objects = response.data || response.result?.objects || response.objects || [];
        allObjects = allObjects.concat(objects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const itemGroups = new Map<string, any[]>();
      const catGroups = new Map<string, any[]>();

      for (const obj of allObjects) {
        if (obj.isDeleted) continue;
        const name = (obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name || "");
        if (!name) continue;
        const norm = normalize(name);

        const group = obj.type === 'CATEGORY' ? catGroups : itemGroups;
        if (!group.has(norm)) group.set(norm, []);
        group.get(norm)!.push(obj);
      }

      const toDelete: string[] = [];
      
      // Process items
      for (const [name, items] of itemGroups.entries()) {
        if (items.length > 1) {
          items.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const redundant = items.slice(1).map(i => i.id);
          toDelete.push(...redundant);
        }
      }
      
      for (const [name, cats] of catGroups.entries()) {
        if (cats.length > 1) {
          cats.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const redundant = cats.slice(1).map(c => c.id);
          toDelete.push(...redundant);
        }
      }

      if (toDelete.length > 0) {
        const uniqueDels = [...new Set(toDelete)];
        for (let i = 0; i < uniqueDels.length; i += 200) {
          await catalog.batchDelete({ objectIds: uniqueDels.slice(i, i + 200) });
        }
        res.json({ success: true, message: `Cleanup Successful. Merged ${uniqueDels.length} duplicates.` });
      } else {
        res.json({ success: true, message: "No duplicates found." });
      }
    } catch (error: any) {
      console.error("Cleanup Error:", error);
      res.status(500).json({ error: error.message || "Cleanup failed" });
    }
  });

  // --- NEW MASTER SERVICE CRUD ---

  // List all services from Master DB
  app.get("/api/admin/services", async (req, res) => {
    try {
      const snapshot = await db.collection('services').orderBy('name').get();
      const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new service (Master Truth)
  app.post("/api/admin/services", async (req, res) => {
    try {
      const data = req.body;
      const ref = await db.collection('services').add({
        ...data,
        active: true,
        syncStatus: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Auto-sync to Square
      const syncResult = await syncServiceToSquare(ref.id, req.headers['x-square-access-token'] as string);
      
      res.json({ id: ref.id, syncResult });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update existing service (Master Truth)
  app.patch("/api/admin/services/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.collection('services').doc(id).update({
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Force Push to Square
      const syncResult = await syncServiceToSquare(id, req.headers['x-square-access-token'] as string);
      res.json({ success: true, syncResult });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete service (Master Truth)
  app.delete("/api/admin/services/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const doc = await db.collection('services').doc(id).get();
      const squareId = doc.data()?.squareId;
      
      await db.collection('services').doc(id).delete();
      
      // Remove from Square if exists
      if (squareId) {
        await deleteServiceFromSquare(squareId, req.headers['x-square-access-token'] as string);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- SQUARE WEBHOOK CONCIERGE ---
  app.post("/api/square/webhook", async (req, res) => {
    const { type, data } = req.body;
    
    // Acknowledgement immediately (Square requirements)
    res.status(200).send("OK");

    if (type === 'catalog.version.updated') {
      console.log('🔔 Square Catalog Change Detected. Checking for drift...');
      // Note: Data.object contains the modified object
      // We check if it's one of ours and if we need to revert it
      try {
        const obj = data.object?.catalog_object;
        if (obj?.type === 'ITEM') {
          await autoCorrectCatalogDrift(obj.id, BigInt(obj.version));
        }
      } catch (err) {
        console.error("Webhook auto-correction failed:", err);
      }
    }
  });

  app.post("/api/admin/cleanup-duplicates", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      console.log('🧹 Nuclear Catalog Flush...');

      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.list({ types: 'CATEGORY,ITEM', cursor });
        if (response.objects) objects = objects.concat(response.objects);
        cursor = response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const currentNames = new Set([
        ...SERVICES.map(s => normalize(s.name)),
        ...CATEGORIES.map(c => normalize(c.name)),
        ...ADD_ONS.map(a => normalize(a.name))
      ]);

      const toDelete: string[] = [];
      for (const obj of objects) {
        if (obj.isDeleted) continue;
        const name = normalize((obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name) || "");
        if (!name) continue;
        
        // If it's a detail related but not in our official list, trash it
        if (!currentNames.has(name)) {
          const isRelated = ['detail', 'wash', 'wax', 'ceramic', 'paint', 'interior', 'exterior', 'rv', 'boat'].some(p => name.includes(p));
          if (isRelated) toDelete.push(obj.id);
        }
      }

      if (toDelete.length > 0) {
        for (let i = 0; i < toDelete.length; i += 200) {
          await catalog.batchDelete({ objectIds: toDelete.slice(i, i + 200) });
        }
      }

      res.json({ success: true, message: `Flushed ${toDelete.length} items.` });
    } catch (error: any) {
      console.error("Flush Error:", error);
      res.status(500).json({ error: error.message || "Flush failed" });
    }
  });

  // Instant Quote Endpoint
  app.post("/api/quote", upload.array("photos", 5), async (req, res) => {
    try {
      const { name, email, phone, year, make, model, type, condition, services } = req.body;
      const files = req.files as Express.Multer.File[];

      console.log(`📩 New Quote Request from ${name} (${email})`);

      // Configure email transporter
      // Note: User needs to provide these in Secrets
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailContent = `
        <h2>New Instant Quote Request</h2>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
        </ul>
        <p><strong>Vehicle Details:</strong></p>
        <ul>
          <li>Year: ${year}</li>
          <li>Make: ${make}</li>
          <li>Model: ${model}</li>
          <li>Type: ${type}</li>
          <li>Condition: ${condition}</li>
        </ul>
        <p><strong>Services Requested:</strong></p>
        <p>${Array.isArray(services) ? services.join(', ') : services || 'None specified'}</p>
        <p><em>Disclaimer: This is an estimate. Final price may vary upon physical inspection.</em></p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Quote Request: ${name} - ${year} ${make} ${model}`,
        html: emailContent,
        attachments: files?.map(file => ({
          filename: file.originalname,
          content: file.buffer
        }))
      };

      // Only attempt to send if credentials are provided
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Quote request sent successfully" });
      } else {
        console.warn("⚠️ Email credentials missing. Quote received but not sent.");
        res.json({ 
          success: true, 
          message: "Quote received! (Note: Email notification skipped due to missing server configuration)",
          debug: { name, email, vehicle: `${year} ${make} ${model}` }
        });
      }
    } catch (error: any) {
      console.error("Quote Submission Error:", error);
      res.status(500).json({ error: error.message || "Failed to submit quote request" });
    }
  });

  // Google Places Reviews Endpoint
  app.get("/api/reviews", async (req, res) => {
    try {
      const apiKey = (req.headers['x-google-maps-api-key'] as string) || process.env.GOOGLE_MAPS_API_KEY;
      const placeId = (req.headers['x-google-place-id'] as string) || process.env.GOOGLE_PLACE_ID;

      if (!apiKey || !placeId) {
        return res.json({ 
          success: false, 
          message: "Google Maps API Key and Place ID must be configured in Admin Setup Wizard",
          reviews: [] 
        });
      }

      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`);

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        let message = `Google Places API error: ${data.status}`;
        if (data.status === 'REQUEST_DENIED') {
          message = "Google Places API request denied. Please ensure: 1. Your API Key is valid. 2. The 'Places API' (Legacy) is enabled in Google Cloud Console. 3. Billing is enabled on your Google Cloud project.";
        } else if (data.status === 'INVALID_REQUEST') {
          message = "Invalid Google Place ID. Please check the Place ID in your settings.";
        }
        
        console.warn(message);
        return res.json({ 
          success: false, 
          message,
          reviews: [] // Frontend will fall back
        });
      }

      // Map Google reviews to our format
      const reviews = (data.result?.reviews || []).map((review: any, index: number) => ({
        id: index + 1,
        name: review.author_name || "Customer",
        role: "Google Review",
        content: review.text || "",
        rating: review.rating || 5,
        image: review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name || 'Customer')}&background=random`
      }));

      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Google Reviews Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch reviews" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
