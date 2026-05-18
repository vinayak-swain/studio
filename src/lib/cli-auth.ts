
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
    
    // Log for debugging (safe slice)
    const tokenDisplay = token.substring(0, 8) + '...';
    console.log(`CLI Auth: Verifying token [${tokenDisplay}]`);
    
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
    
    console.warn(`CLI Auth: Token [${tokenDisplay}] not found in database`);
    return null;
  } catch (error: any) {
    // Log the actual error to help diagnose environment issues (e.g. missing credentials)
    console.error('CLI Auth verification FAILED:', error.message);
    if (error.stack) console.error(error.stack);
    return null;
  }
}
