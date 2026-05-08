
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeCliPush } from '@/ai/flows/cli-code-analysis';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const { files, message, repoId } = await req.json();

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // Validate token
    const tokenDoc = await getDoc(doc(db, 'cli_tokens', token));
    if (!tokenDoc.exists()) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = tokenDoc.data().userId;

    // Simulate pushing code to Firestore (In reality, we'd use Storage)
    const pushRef = await addDoc(collection(db, 'users', userId, 'repositories', repoId, 'pushes'), {
      message,
      fileCount: files.length,
      createdAt: serverTimestamp(),
      pushedBy: 'CLI',
    });

    // AI Analysis
    const analysis = await analyzeCliPush({ files, message });

    return NextResponse.json({ 
      success: true, 
      id: pushRef.id,
      analysis 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
