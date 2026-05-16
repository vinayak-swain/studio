import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

/**
 * Verifies a CLI token against the Firestore 'cli_tokens' collection.
 */
export async function verifyCliToken(token: string) {
  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);
    
    const tokenDoc = await getDoc(doc(db, 'cli_tokens', token));
    
    if (tokenDoc.exists()) {
      return tokenDoc.data();
    }
    return null;
  } catch (error) {
    console.error('CLI Auth verification failed:', error);
    return null;
  }
}
