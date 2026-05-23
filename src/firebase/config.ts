import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let db: any = null;
let isRealFirebase = false;

// Try loading variables from Vite environment variables (e.g. on Netlify)
const envConfig: any = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || "(default)"
};

// Check if environment variables are fully defined
const hasEnvConfig = !!(envConfig.apiKey && envConfig.projectId);

// Dynamic config selection with type casting
const activeConfig: any = hasEnvConfig ? envConfig : ((firebaseConfig as any) || {});

// Check if we have a real, valid Firebase configuration
const isConfigured = activeConfig && 
                   activeConfig.apiKey && 
                   activeConfig.apiKey !== 'mock-api-key-replace-me' &&
                   activeConfig.projectId !== 'mock-project';

if (isConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(activeConfig);
    } else {
      app = getApp();
    }
    db = getFirestore(app, activeConfig.firestoreDatabaseId || "(default)");
    isRealFirebase = true;
    console.log("Firebase initialized successfully with project:", activeConfig.projectId, hasEnvConfig ? "via Environment" : "via Config File");
  } catch (error) {
    console.error("Firebase failed to initialize. Falling back to Local Storage mode:", error);
  }
} else {
  console.log("Using Mock/Local Storage database workspace. To connect to Cloud, accept terms in Firebase UI or define VITE_FIREBASE_* env variables.");
}

export { db, isRealFirebase };

