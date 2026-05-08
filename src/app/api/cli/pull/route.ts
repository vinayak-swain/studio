
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get('repoId');
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // Validate token
    const tokenDoc = await getDoc(doc(db, 'cli_tokens', token));
    if (!tokenDoc.exists()) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // In a real app, we'd fetch actual files from Storage or a Git server
    // For the prototype, we return a mock success
    return NextResponse.json({ 
      success: true, 
      files: [
        { path: 'README.md', content: '# DevNest Project\nPulled from cloud.' },
        { path: 'package.json', content: '{"name": "pulled-app"}' }
      ] 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
