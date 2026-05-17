
import { initializeAdmin } from './firebase-admin';

/**
 * Verifies a CLI token using the Admin SDK.
 * Bypasses security rules to check token existence and validity.
 */
export async function verifyCliToken(token: string) {
  if (!token) {
    console.error('CLI Auth: No token provided');
    return null;
  }

  try {
    const { adminDb } = initializeAdmin();
    
    // Log for debugging
    console.log('CLI Auth: Verifying token...', token.substring(0, 8) + '...');
    
    const tokenDoc = await adminDb.collection('cli_tokens').doc(token).get();
    
    if (tokenDoc.exists) {
      const data = tokenDoc.data();
      console.log('CLI Auth: Token verified for user:', data?.email);
      return data as {
        userId: string;
        email: string;
        name: string;
      };
    }
    
    console.warn('CLI Auth: Token not found in database');
    return null;
  } catch (error) {
    console.error('CLI Auth verification failed:', error);
    return null;
  }
}
