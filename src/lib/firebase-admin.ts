
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

/**
 * Initializes the Firebase Admin SDK for server-side operations.
 * Bypasses Firestore Security Rules for administrative tasks.
 */
export function initializeAdmin() {
  let adminApp: App;

  if (!getApps().length) {
    // We explicitly provide the projectId to ensure the Admin SDK
    // targets the correct project, especially in local dev environments.
    adminApp = initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log('Firebase Admin initialized for project:', firebaseConfig.projectId);
  } else {
    adminApp = getApps()[0];
  }

  return {
    adminDb: getFirestore(adminApp),
    adminAuth: getAuth(adminApp),
  };
}
