
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
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
    console.log('Admin SDK: Initializing for project', firebaseConfig.projectId);
    try {
      // In a production or "Studio" environment, Admin SDK often picks up 
      // service account credentials from environment variables automatically.
      adminApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    } catch (e: any) {
      console.error('Admin SDK: Initialization FAILED', e.message);
      throw e;
    }
  } else {
    adminApp = existingApp;
  }

  const adminDb = getFirestore(adminApp);
  const adminAuth = getAuth(adminApp);

  if (!adminDb) {
    throw new Error('Admin SDK: Firestore service failed to initialize');
  }

  return {
    adminDb,
    adminAuth,
  };
}
