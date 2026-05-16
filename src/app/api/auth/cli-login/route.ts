
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { initializeAdmin } from '@/lib/firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import crypto from 'crypto';

/**
 * Handles terminal-based login requests.
 * Authenticates credentials via Client SDK, then stores token via Admin SDK.
 */
export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // 1. Verify credentials using Client SDK Auth
    const { auth } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Generate a secure CLI token
    const token = crypto.randomBytes(32).toString('hex');
    
    // 3. Use Admin SDK to store the token (bypassing rules)
    const { adminDb } = initializeAdmin();
    
    await adminDb.collection('cli_tokens').doc(token).set({
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
