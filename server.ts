import express from "express";
import { getSquareClient, getSquareLocationId } from "./src/services/square.ts";
import { randomUUID } from "crypto";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";
import { SERVICES, CATEGORIES, VEHICLE_SIZES, SPECIALTY_SIZES, ADD_ONS } from "./src/data/services.ts";
import { logToSystem, logSquareError, LogLevel } from "./src/services/errorLogger.ts";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

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
  app.get("/api/admin/force-migrate", async (req, res) => {
    try {
      res.json({ status: "ok", count: 0, message: "Disabled as Firestore is no longer used for backend service syncing." });
    } catch (e: any) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

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
      res.json([]);
    }
  });

  // Square Availability API
  app.get("/api/availability", async (req, res) => {
    try {
      const { start, end, serviceVariationId, serviceVariationIds } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required" });
      }

      const client = getClientFromReq(req) as any;
      const ids = serviceVariationIds ? (serviceVariationIds as string).split(',') : [(serviceVariationId as string) || "ANY_SERVICE_VARIATION_ID"];
      
      const response = await client.bookings.searchAvailability({
        query: {
          filter: {
            startAtRange: {
              startAt: start as string,
              endAt: end as string,
            },
            locationId: getLocFromReq(req),
            segmentFilters: ids.map(id => ({
              serviceVariationId: id,
            }))
          }
        }
      });

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

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: "Booking Confirmed - Bryan's Showroom Quality Detailing",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #111;">Booking Confirmed!</h2>
                <p>Hi ${customer.firstName},</p>
                <p>We've received your booking for <strong>${formattedDate}</strong>.</p>
                <p>A $50 non-refundable deposit is required to secure your appointment.</p>
                <p><strong>Appointment Details:</strong></p>
                <ul>
                  <li>Location: Bellevue / Omaha Metro</li>
                  <li>Time: ${formattedDate}</li>
                </ul>
                <p>If you have any questions, feel free to call us at (712) 305-6313.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">Bryan's Showroom Quality Detailing</p>
              </div>
            `
          });
        } catch (emailErr) {
          console.error("Email Notification Error:", emailErr);
        }
      }

      res.json(booking);
    } catch (error: any) {
      console.error("Square Booking Error:", error);
      res.status(500).json({ error: error.message || "Failed to create booking" });
    }
  });

  // Admin Sync Endpoint - Robust Idempotent Upsert
  app.post("/api/admin/sync-square", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog, teamMembers } = client;
      
      console.log('🚀 Starting Square Sync (Idempotent Mode)...');

      // 1. Fetch existing catalog to map names to IDs (prevents duplicates)
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
          .replace(/[^a-z0-9]/g, '')
          .trim();
      };
      
      const existingItemsByNorm = new Map<string, { id: string; version?: bigint }>();
      for (const obj of allObjects) {
        if (obj.isDeleted || obj.type !== 'ITEM') continue;
        existingItemsByNorm.set(normalize(obj.itemData.name), { id: obj.id, version: obj.version });
      }

      // Check for team members for availability
      const teamMemberIds: string[] = [];
      try {
        const teamResult = await teamMembers.search({ query: { filter: { status: 'ACTIVE' } } });
        teamMemberIds.push(...(teamResult.teamMembers?.map((tm: any) => tm.id) || []));
      } catch (e) {
        console.warn("Team member fetch skipped:", e);
      }

      const syncTimestamp = Date.now();

      // Sync categories first
      const categoryIdMap: Record<string, string> = {};
      for (const cat of CATEGORIES) {
        const catNorm = normalize(cat.name);
        const existingCat = allObjects.find(obj => obj.type === 'CATEGORY' && normalize(obj.categoryData.name) === catNorm);
        
        const upsertRes = await catalog.object.upsert({
          idempotencyKey: `cat-${cat.id}-${syncTimestamp}`,
          object: {
            type: 'CATEGORY',
            id: existingCat?.id || `#${cat.id}`,
            version: existingCat?.version,
            categoryData: { name: cat.name },
          }
        });
        const finalId = upsertRes.catalogObject?.id;
        if (finalId) categoryIdMap[cat.id] = finalId;
      }

      let syncedCount = 0;
      const allItems = [...SERVICES, ...ADD_ONS.map(a => ({ ...a, categoryId: 'add-ons', isAddon: true }))];
      const syncedItemIds = new Set<string>();

      for (const item of allItems as any[]) {
        const norm = normalize(item.name);
        const existing = existingItemsByNorm.get(norm);
        
        // Calculate duration logic
        let durationMinutes = 60;
        if (item.duration) {
          const durStr = typeof item.duration === 'string' ? item.duration : (item.duration.car || Object.values(item.duration)[0]);
          const match = durStr.match(/(\d+)/);
          if (match) {
            durationMinutes = parseInt(match[1]);
            if (durStr.toLowerCase().includes('hour') || durStr.toLowerCase().includes('hr')) {
              durationMinutes *= 60;
            }
          }
        }

        const variations = item.isAddon ? [{
          type: 'ITEM_VARIATION',
          id: `#var-${item.id}`,
          itemVariationData: {
            name: 'Standard',
            pricingType: 'FIXED_PRICING',
            serviceDuration: BigInt(durationMinutes * 60 * 1000),
            availableForBooking: true,
            priceMoney: {
              amount: BigInt(item.price * 100),
              currency: 'USD',
            },
            ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
          },
        }] : (item.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES).map(size => {
          const price = item.price[size.id];
          if (price === undefined) return null;
          return {
            type: 'ITEM_VARIATION',
            id: `#var-${item.id}-${size.id}`,
            itemVariationData: {
              name: size.name,
              pricingType: 'FIXED_PRICING',
              serviceDuration: BigInt(durationMinutes * 60 * 1000),
              availableForBooking: true,
              priceMoney: {
                amount: BigInt(price * 100),
                currency: 'USD',
              },
              ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
            },
          };
        }).filter(Boolean);

        const upsertRes = await catalog.object.upsert({
          idempotencyKey: `item-${item.id}-${syncTimestamp}`,
          object: {
            type: 'ITEM',
            id: existing?.id || `#${item.id}`,
            version: existing?.version,
            itemData: {
              name: item.name,
              description: item.longDescription || item.shortDescription || item.description || '',
              categoryId: categoryIdMap[item.categoryId],
              productType: 'APPOINTMENTS_SERVICE',
              variations: variations as any,
            },
          },
        });

        const finalId = upsertRes.catalogObject?.id;
        if (finalId) syncedItemIds.add(finalId);
        syncedCount++;
      }

      // 4. PRUNING: Delete items in Square that are NOT in our local synced set
      const toDeleteIds: string[] = [];
      for (const obj of allObjects) {
        if (obj.type === 'ITEM' && !obj.isDeleted && !syncedItemIds.has(obj.id)) {
          // Extra safety: only delete if it looks like a detailing service or category match
          // (Actually, user explicitly asked to delete what doesn't match the website)
          toDeleteIds.push(obj.id);
        }
      }

      if (toDeleteIds.length > 0) {
        console.log(`🗑️ Pruning ${toDeleteIds.length} extra items from Square...`);
        // Use batchDelete (limit 200 per call, we probably have less)
        await catalog.batchDelete({ objectIds: toDeleteIds });
      }

      // 5. Removed Firestore Master Sync. Local codebase is the only source.
      let masterSyncMsg = "";

      res.json({ 
        success: true, 
        message: `Sync & Prune Complete. Updated ${syncedCount} items, Removed ${toDeleteIds.length} extras.${masterSyncMsg}` 
      });
      
      await logToSystem({
        level: LogLevel.INFO,
        source: 'SquareSync',
        message: 'Manual Square Sync completed successfully',
        details: { syncedCount, prunedCount: toDeleteIds.length, masterSyncMsg }
      });
    } catch (error: any) {
      console.error("Sync Error:", error);
      await logSquareError('SquareSync', 'Manual Square Sync failed', error);
      res.status(500).json({ 
        error: "Square Synchronization failed. Please check your Access Token and Location ID in the Setup Wizard.",
        details: error.message 
      });
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
      // Return static services since we removed Firestore Admin duties
      res.json(SERVICES);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Square Webhook Concierge
  app.post("/api/square/webhook", async (req, res) => {
    const { type, data } = req.body;
    
    // Acknowledgement immediately (Square requirements)
    res.status(200).send("OK");

    if (type === 'catalog.version.updated') {
      console.log('🔔 Square Catalog Change Detected. Server auto-correction is currently disabled.');
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
      let apiKey = req.headers['x-google-maps-api-key'] as string;
      if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
        apiKey = process.env.GOOGLE_MAPS_API_KEY as string;
      }

      let placeId = req.headers['x-google-place-id'] as string;
      if (!placeId || placeId === 'undefined' || placeId === 'null' || placeId === '') {
        placeId = process.env.GOOGLE_PLACE_ID as string;
      }

      if (!apiKey || !placeId || placeId === 'undefined' || apiKey === 'undefined' || placeId === 'null' || apiKey === 'null') {
        return res.json({ 
          success: false, 
          message: "Google Maps API Key and Place ID must be configured in Admin Setup Wizard",
          reviews: [] 
        });
      }

      // Use Places API (New) which supports API keys with HTTP Referrer restrictions
      // We pass the origin/referer from the client to the Google API
      const referer = req.get('origin') || req.get('referer') || 'https://bryansdetailingomaha.com';
      
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=reviews`, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'Referer': referer
        }
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok || data.error) {
        const errorData = data.error || {};
        let message = `Google Places API error: ${errorData.status || errorData.code || response.statusText}`;
        console.warn(message, errorData.message || response.status);
        return res.json({ 
          success: false, 
          message: errorData.message || message,
          reviews: [] // Frontend will fall back
        });
      }

      // Map Google reviews to our format
      const reviews = (data.reviews || []).map((review: any, index: number) => ({
        id: index + 1,
        name: review.authorAttribution?.displayName || "Customer",
        role: "Google Review",
        content: review.text?.text || review.originalText?.text || "",
        rating: review.rating || 5,
        image: review.authorAttribution?.photoUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorAttribution?.displayName || 'Customer')}&background=random`
      }));

      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Google Reviews Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch reviews" });
    }
  });

  // Admin Logs Endpoint
  app.get("/api/admin/logs", async (req, res) => {
    try {
      // Mock logs response since Firestore logs are disabled
      res.json([]);
    } catch (error: any) {
      console.error("Failed to fetch logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
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
