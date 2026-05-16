import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getFirestore, collection, getDocs } from 'firebase/firestore';
import { verifyCliToken } from '@/lib/cli-auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get('repoId');
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const userData = await verifyCliToken(token);

  if (!userData || !repoId) {
    return NextResponse.json({ error: 'Unauthorized or missing parameters' }, { status: 401 });
  }

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // Fetch all files for this repository
    const filesRef = collection(db, 'users', userData.userId, 'repositories', repoId, 'files');
    const snapshot = await getDocs(filesRef);

    if (snapshot.empty) {
      return NextResponse.json({ 
        files: [],
        message: 'No files found',
      });
    }

    const files = snapshot.docs.map(doc => ({
      path: doc.data().path,
      content: doc.data().content
    }));

    return NextResponse.json({ 
      success: true, 
      files 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
