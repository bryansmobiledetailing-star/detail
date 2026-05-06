import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json';

if (!admin.apps.length) {
  admin.initializeApp();
}

async function diagnose() {
  console.log("Project ID:", firebaseConfig.projectId);
  console.log("Database ID:", firebaseConfig.firestoreDatabaseId);
  
  try {
    const dbDefault = getFirestore();
    const snapDefault = await dbDefault.collection('services').limit(1).get();
    console.log("Default DB access: SUCCESS, count:", snapDefault.size);
  } catch (err: any) {
    console.error("Default DB access: FAILED", err.message);
  }

  try {
    const dbNamed = getFirestore(firebaseConfig.firestoreDatabaseId);
    const snapNamed = await dbNamed.collection('services').limit(1).get();
    console.log("Named DB access: SUCCESS, count:", snapNamed.size);
  } catch (err: any) {
    console.error("Named DB access: FAILED", err.message);
  }
}

diagnose();
