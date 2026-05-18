
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { initializeAdmin } from '@/lib/firebase-admin';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  inMemoryPersistence, 
  setPersistence 
} from 'firebase/auth';
import crypto from 'crypto';

/**
 * Handles terminal-based login requests.
 * Authenticates credentials via Client SDK, then stores token via Admin SDK.
 */
export async function POST(req: Request) {
  console.log('CLI Login: Request received');
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Initialize Firebase Client SDK for Server-side verification
    const { firebaseApp } = initializeFirebase();
    const auth = getAuth(firebaseApp);
    
    // Crucial: Set persistence to 'none' (inMemory) to avoid browser-specific API crashes on the server
    await setPersistence(auth, inMemoryPersistence);

    console.log(`CLI Login: Attempting auth for ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('User authentication failed: No user returned');
    }

    // 2. Generate a secure CLI token
    const token = crypto.randomBytes(32).toString('hex');
    
    // 3. Use Admin SDK to store the token
    console.log('CLI Login: Initializing Admin SDK for token storage');
    const { adminDb } = initializeAdmin();
    
    const userData = {
      userId: user.uid,
      email: user.email,
      name: user.displayName || user.email?.split('@')[0],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };

    console.log(`CLI Login: Storing token for user ID ${user.uid}`);
    await adminDb.collection('cli_tokens').doc(token).set(userData);
    
    console.log(`CLI Login: Success! Token generated for ${user.email}`);

    return NextResponse.json({ 
      token, 
      email: userData.email,
      name: userData.name
    });
  } catch (error: any) {
    console.error('CLI Login CRITICAL ERROR:', error.message);
    if (error.stack) console.error(error.stack);
    
    // Return structured error
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error during authentication' 
    }, { status: error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' ? 401 : 500 });
  }
}
