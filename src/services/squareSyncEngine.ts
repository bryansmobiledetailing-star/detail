import { SquareClient } from 'square';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getSquareClient, getSquareLocationId } from './square';
import { randomUUID } from 'crypto';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);

export interface SquareSyncResult {
  success: boolean;
  squareId?: string;
  version?: bigint;
  error?: string;
  message?: string;
}

/**
 * Pushes a service from our app to Square Catalog.
 * Our app is the master. Square follows.
 */
export async function syncServiceToSquare(serviceId: string, accessToken?: string): Promise<SquareSyncResult> {
  try {
    const serviceDoc = await db.collection('services').doc(serviceId).get();
    if (!serviceDoc.exists) {
      throw new Error(`Service ${serviceId} not found in master database.`);
    }

    const service = serviceDoc.data()!;
    const client = getSquareClient(accessToken) as any;
    const locationId = getSquareLocationId();

    // Handle INACTIVE services
    if (service.active === false) {
      if (service.squareId) {
        console.log(`🗑️ Service ${service.name} is INACTIVE. Removing from Square...`);
        await deleteServiceFromSquare(service.squareId, accessToken);
        await db.collection('services').doc(serviceId).update({
          squareId: admin.firestore.FieldValue.delete(),
          squareVersion: admin.firestore.FieldValue.delete(),
          syncStatus: 'removed',
          lastSyncAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: true, message: 'Removed inactive service from Square' };
      }
      return { success: true, message: 'Service is inactive and not in Square' };
    }

    // 2. Map variations (Vehicle sizes)
    const variations = Object.entries(service.price).map(([sizeId, price]) => {
      // Find duration specific to this size if possible
      let variationDurationStr = "60 min";
      if (typeof service.duration === 'string') {
        variationDurationStr = service.duration;
      } else if (service.duration && typeof service.duration === 'object') {
        variationDurationStr = service.duration[sizeId] || Object.values(service.duration)[0] || "60 min";
      }

      // Calculate duration in milliseconds for this variation
      const durationMatch = variationDurationStr.match(/(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*(hour|hr|min|day)/i);
      let durationMinutes = 60;
      if (durationMatch) {
        const v1 = parseFloat(durationMatch[1]);
        const v2 = durationMatch[2] ? parseFloat(durationMatch[2]) : v1;
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
      const durationMs = BigInt(durationMinutes * 60 * 1000);

      // We use a deterministic ID mapping in Square so we can overwrite correctly
      // Format: master-svc-{serviceId}-{sizeId}
      const variationId = `#var-${serviceId}-${sizeId}`;
      
      return {
        type: 'ITEM_VARIATION',
        id: variationId,
        itemVariationData: {
          name: sizeId.toUpperCase(),
          pricingType: 'FIXED_PRICING',
          serviceDuration: durationMs,
          availableForBooking: true,
          priceMoney: {
            amount: BigInt(Math.round(Number(price) * 100)),
            currency: 'USD',
          },
        },
      };
    });

    // 3. Upsert to Square
    const response = await client.catalogApi.upsertCatalogObject({
      idempotencyKey: randomUUID(),
      object: {
        type: 'ITEM',
        id: service.squareId || `#${serviceId}`,
        version: service.squareVersion ? BigInt(service.squareVersion) : undefined,
        itemData: {
          name: service.name,
          description: service.description,
          productType: 'APPOINTMENTS_SERVICE',
          variations: variations as any[],
        },
      },
    });

    const catalogObject = response.result.object;
    if (!catalogObject) {
      throw new Error('Square returned empty result during upsert.');
    }

    // 4. Update our master record with Square references
    await db.collection('services').doc(serviceId).update({
      squareId: catalogObject.id,
      squareVersion: Number(catalogObject.version),
      lastSyncAt: admin.firestore.FieldValue.serverTimestamp(),
      syncStatus: 'synced'
    });

    // 5. Log the success
    await db.collection('sync_logs').add({
      serviceId,
      action: service.squareId ? 'update' : 'create',
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      squareResponse: { id: catalogObject.id, version: catalogObject.version }
    });

    return {
      success: true,
      squareId: catalogObject.id,
      version: catalogObject.version
    };

  } catch (error: any) {
    console.error(`❌ Sync Engine Failure [${serviceId}]:`, error);
    
    await db.collection('services').doc(serviceId).update({
      syncStatus: 'mismatch',
      syncError: error.message
    });

    await db.collection('sync_logs').add({
      serviceId,
      action: 'update',
      status: 'failed',
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: false, error: error.message };
  }
}

/**
 * Removes a service from Square when deleted in our app.
 */
export async function deleteServiceFromSquare(squareId: string, accessToken?: string) {
  const client = getSquareClient(accessToken) as any;
  try {
    await client.catalogApi.batchDeleteCatalogObjects({ objectIds: [squareId] });
  } catch (error) {
    console.error('❌ Failed to delete from Square Catalog:', error);
  }
}

/**
 * Handles Webhooks from Square.
 * Detects if an item was changed in Square Dashboard and corrects it 
 * if it doesn't match our master version.
 */
export async function autoCorrectCatalogDrift(squareObjectId: string, squareVersion: bigint, accessToken?: string) {
  // 1. Find the service in our DB by squareId
  const servicesSnapshot = await db.collection('services')
    .where('squareId', '==', squareObjectId)
    .limit(1)
    .get();

  if (servicesSnapshot.empty) return; // Not one of our master services

  const serviceDoc = servicesSnapshot.docs[0];
  const service = serviceDoc.data();

  // 2. If Square version is newer than ours, it means an external change happened
  if (BigInt(service.squareVersion || 0) < squareVersion) {
    console.log(`⚠️ DETECTED DRIFT for ${service.name}. Square version (${squareVersion}) > Master version (${service.squareVersion}). Overwriting Square...`);
    
    // Trigger a sync to push our master truth back to Square
    await syncServiceToSquare(serviceDoc.id, accessToken);
    
    await db.collection('sync_logs').add({
      serviceId: serviceDoc.id,
      action: 'correct',
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      error: `Detected external change in Square (version ${squareVersion}). Force-mirrored master truth.`
    });
  }
}

/**
 * Full Consistency Check:
 * Sweeps all services in Firestore and ensures Square matches.
 * Also deletes any items in Square that aren't in Firestore "services" collection.
 */
export async function syncAllFirestoreToSquare(accessToken?: string) {
  console.log('🔄 Starting Full Firestore -> Square Consistency Sync...');
  const client = getSquareClient(accessToken) as any;
  
  // 1. Get all from Firestore
  const masterSnapshot = await db.collection('services').get();
  const masterServices = masterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const activeMasterIds = new Set(masterServices.filter((s: any) => s.active !== false).map(s => s.id));

  // 2. Sync each active service (Upsert)
  const syncPromises = masterServices.map(svc => syncServiceToSquare(svc.id, accessToken));
  await Promise.all(syncPromises);

  // 3. Prune orphans: things in Square that aren't in our active master list
  // Fetch everything from Square Catalog
  let squareItems: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const response: any = await client.catalogApi.listCatalog({ cursor, types: 'ITEM' });
    squareItems = squareItems.concat(response.result.objects || []);
    cursor = response.result.cursor;
  } while (cursor);

  const toDelete: string[] = [];
  for (const item of squareItems) {
    if (item.isDeleted) continue;
    
    // Check if it belongs to us (by ID pattern or by looking up in our DB)
    // Our synced items usually have IDs like 'master-svc-...' or we store the ID in Firestore
    const isOurService = masterServices.some((s: any) => s.squareId === item.id);
    const belongsToUsButInactive = masterServices.some((s: any) => s.squareId === item.id && s.active === false);
    
    // If it's an item we manage but shouldn't be there, or if it has our signature ID pattern but isn't in our DB
    if (belongsToUsButInactive) {
      toDelete.push(item.id);
    }
  }

  if (toDelete.length > 0) {
    console.log(`🗑️ Full Sync: Pruning ${toDelete.length} inactive/orphaned items from Square.`);
    await client.catalogApi.batchDeleteCatalogObjects({ objectIds: toDelete });
  }

  return { syncedCount: masterServices.length, prunedCount: toDelete.length };
}
