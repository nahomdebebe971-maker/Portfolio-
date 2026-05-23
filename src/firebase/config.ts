import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let db: any = null;
let isRealFirebase = false;

// Check if we have a real Firebase config
const isConfigured = firebaseConfig && 
                   firebaseConfig.apiKey && 
                   firebaseConfig.apiKey !== 'mock-api-key-replace-me' &&
                   firebaseConfig.projectId !== 'mock-project';

if (isConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    isRealFirebase = true;
    console.log("Firebase initialized successfully with real project:", firebaseConfig.projectId);
  } catch (error) {
    console.error("Firebase failed to initialize. Falling back to Local Storage mode:", error);
  }
} else {
  console.log("Using Mock/Local Storage database workspace. To connect to Cloud, accept terms in Firebase UI.");
}

export { db, isRealFirebase };

