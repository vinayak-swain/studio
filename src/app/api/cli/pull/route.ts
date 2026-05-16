import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { verifyCliToken } from '@/lib/cli-auth';

/**
 * Sends all current repository files to the CLI for local synchronization.
 */
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

    // Fetch all files currently in the repo
    const filesRef = collection(db, 'users', userData.userId, 'repositories', repoId, 'files');
    const snapshot = await getDocs(filesRef);

    const files = snapshot.docs.map(doc => ({
      path: doc.data().path,
      content: doc.data().content
    }));

    // Get latest commit metadata
    const commitsQuery = query(
      collection(db, 'users', userData.userId, 'repositories', repoId, 'commits'),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const commitSnap = await getDocs(commitsQuery);
    const lastCommit = commitSnap.docs[0]?.data() || { message: 'Initial state' };

    return NextResponse.json({ 
      success: true, 
      files,
      message: lastCommit.message,
      commitId: commitSnap.docs[0]?.id || 'initial'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
