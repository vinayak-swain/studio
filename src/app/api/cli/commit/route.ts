
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { verifyCliToken } from '@/lib/cli-auth';
import { analyzeCliPush } from '@/ai/flows/cli-code-analysis';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const userData = await verifyCliToken(token);

  if (!userData) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { message, repoId, changes } = await req.json();

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // Mock analysis for a metadata-only commit (since files aren't sent in 'commit')
    // In a real DVCS, commit might just record the local state diff
    const analysis = await analyzeCliPush({ files: [], message });

    const commitRef = await addDoc(collection(db, 'users', userData.userId, 'repositories', repoId, 'commits'), {
      message,
      changesSummary: changes,
      createdAt: serverTimestamp(),
      aiAnalysis: analysis
    });

    return NextResponse.json({ 
      success: true, 
      commitId: commitRef.id,
      message,
      aiAnalysis: analysis
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
