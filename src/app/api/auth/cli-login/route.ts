
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
  try {
    const { email, password } = await req.json();

    // 1. Verify credentials using Client SDK Auth (Server-side)
    const { auth } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Generate a secure CLI token
    const token = crypto.randomBytes(32).toString('hex');
    
    // 3. Use Admin SDK to store the token (bypassing rules)
    const { adminDb } = initializeAdmin();
    
    const userData = {
      userId: user.uid,
      email: user.email,
      name: user.displayName || user.email?.split('@')[0],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };

    await adminDb.collection('cli_tokens').doc(token).set(userData);
    
    console.log(`CLI Login: Generated token for ${user.email}`);

    return NextResponse.json({ 
      token, 
      email: userData.email,
      name: userData.name
    });
  } catch (error: any) {
    console.error('CLI Login Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
