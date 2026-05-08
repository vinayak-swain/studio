
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeCliPush } from '@/ai/flows/cli-code-analysis';
import { verifyCliToken } from '@/lib/cli-auth';

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

  const { files, message, repoId } = await req.json();

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // AI Analysis
    const analysis = await analyzeCliPush({ files, message });

    // Create push/commit record
    const pushRef = await addDoc(collection(db, 'users', userData.userId, 'repositories', repoId, 'pushes'), {
      message,
      fileCount: files.length,
      createdAt: serverTimestamp(),
      pushedBy: 'CLI',
      aiAnalysis: analysis,
    });

    // In a real app, we would also store the files themselves in Storage or specific collections
    // For this prototype, we store the metadata and analysis

    return NextResponse.json({ 
      success: true, 
      commitId: pushRef.id,
      fileCount: files.length,
      aiAnalysis: analysis 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
