import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin
let app;
if (getApps().length === 0) {
  try {
    // First try to use environment variables if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || 'mini-football-booking',
      });
      console.log('Firebase Admin initialized successfully with environment variables');
    } 
    // Fallback to service account file
    else {
      const serviceAccountPath = path.join(process.cwd(), 'server', 'firebase-service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        app = initializeApp({
          credential: cert(serviceAccountPath),
          projectId: process.env.FIREBASE_PROJECT_ID || 'mini-football-booking',
        });
        console.log('Firebase Admin initialized successfully with service account file');
      } else {
        throw new Error('Firebase service account file not found');
      }
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Fallback to default credentials
    app = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'mini-football-booking',
    });
    console.log('Firebase Admin initialized with default credentials');
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
export { app as adminApp };