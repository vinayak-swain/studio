
import { initializeAdmin } from './firebase-admin';

/**
 * Verifies a CLI token using the Admin SDK.
 * Bypasses security rules to check token existence and validity.
 */
export async function verifyCliToken(token: string) {
  try {
    const { adminDb } = initializeAdmin();
    
    const tokenDoc = await adminDb.collection('cli_tokens').doc(token).get();
    
    if (tokenDoc.exists) {
      return tokenDoc.data() as {
        userId: string;
        email: string;
        name: string;
      };
    }
    return null;
  } catch (error) {
    console.error('CLI Auth verification failed:', error);
    return null;
  }
}
