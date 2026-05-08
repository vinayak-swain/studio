
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
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

    // Fetch the latest push for this repository to simulate pulling code
    const pushesRef = collection(db, 'users', userData.userId, 'repositories', repoId, 'pushes');
    const q = query(pushesRef, orderBy('createdAt', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ 
        files: [],
        message: 'No commits found',
        commitId: 'none'
      });
    }

    const latestPush = snapshot.docs[0].data();

    // For the prototype, we return mock file contents associated with the latest state
    return NextResponse.json({ 
      success: true, 
      commitId: snapshot.docs[0].id,
      message: latestPush.message,
      timestamp: latestPush.createdAt,
      files: [
        { path: 'README.md', content: `# ${latestPush.repoName || 'Project'}\nPulled from DevNest.` },
        { path: 'package.json', content: '{\n  "name": "devnest-app",\n  "version": "1.0.0"\n}' }
      ] 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
