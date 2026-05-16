
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

/**
 * Initializes the Firebase Admin SDK for server-side operations.
 * Bypasses Firestore Security Rules for administrative tasks.
 */
export function initializeAdmin() {
  let adminApp: App;

  if (!getApps().length) {
    adminApp = initializeApp();
  } else {
    adminApp = getApps()[0];
  }

  return {
    adminDb: getFirestore(adminApp),
    adminAuth: getAuth(adminApp),
  };
}
