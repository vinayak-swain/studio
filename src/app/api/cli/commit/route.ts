
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const { message, repoId, changes } = await req.json();

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    const tokenDoc = await getDoc(doc(db, 'cli_tokens', token));
    if (!tokenDoc.exists()) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = tokenDoc.data().userId;

    const commitRef = await addDoc(collection(db, 'users', userId, 'repositories', repoId, 'commits'), {
      message,
      changesSummary: changes,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, commitId: commitRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
