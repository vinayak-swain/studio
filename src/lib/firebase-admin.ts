
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

/**
 * Initializes the Firebase Admin SDK for server-side operations.
 * Bypasses Firestore Security Rules for administrative tasks.
 */
export function initializeAdmin() {
  let adminApp: App;

  const apps = getApps();
  const existingApp = apps.find(a => a.name === '[DEFAULT]');

  if (!existingApp) {
    try {
      // In a production or "Studio" environment, Admin SDK often picks up 
      // service account credentials from environment variables automatically.
      adminApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
      console.log('Firebase Admin initialized for project:', firebaseConfig.projectId);
    } catch (e: any) {
      console.error('Firebase Admin initialization failed:', e.message);
      throw e;
    }
  } else {
    adminApp = existingApp;
  }

  return {
    adminDb: getFirestore(adminApp),
    adminAuth: getAuth(adminApp),
  };
}
