
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { verifyCliToken } from '@/lib/cli-auth';

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const userData = await verifyCliToken(token);

  if (!userData) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);
    
    const reposRef = collection(db, 'users', userData.userId, 'repositories');
    const snapshot = await getDocs(reposRef);
    
    const repositories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(repositories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
