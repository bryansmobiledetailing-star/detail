import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { SERVICES } from '../src/data/services';
import firebaseConfig from '../firebase-applet-config.json';

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);

async function migrate() {
  console.log('🚀 Migrating static services to Firestore master list...');
  
  const servicesCol = db.collection('services');
  
  for (const service of SERVICES) {
    const docRef = servicesCol.doc(service.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`✅ Adding ${service.name}...`);
      await docRef.set({
        ...service,
        active: true,
        syncStatus: 'pending',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
       console.log(`⏩ Skipping ${service.name} (already exists)`);
    }
  }
  
  console.log('🎉 Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
