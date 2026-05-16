import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import crypto from 'crypto';

/**
 * Handles terminal-based login requests.
 * Authenticates with Firebase and returns a persistent CLI token.
 */
export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const { auth, firebaseApp } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a secure 64-character CLI token
    const token = crypto.randomBytes(32).toString('hex');
    const db = getFirestore(firebaseApp);

    // Store token in Firestore for verification by other CLI endpoints
    await setDoc(doc(db, 'cli_tokens', token), {
      userId: user.uid,
      email: user.email,
      name: user.displayName || user.email?.split('@')[0],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    });

    return NextResponse.json({ 
      token, 
      email: user.email,
      name: user.displayName || user.email?.split('@')[0]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
