
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const { auth, firebaseApp } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a secure CLI token
    const token = crypto.randomBytes(32).toString('hex');
    const db = getFirestore(firebaseApp);

    // Store token in Firestore with user reference
    await setDoc(doc(db, 'cli_tokens', token), {
      userId: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    });

    return NextResponse.json({ 
      token, 
      user: { uid: user.uid, email: user.email } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
