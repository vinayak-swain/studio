
import { NextResponse } from 'next/server';
import { initializeAdmin } from '@/lib/firebase-admin';
import { verifyCliToken } from '@/lib/cli-auth';

/**
 * Lists repositories for the authenticated CLI user.
 */
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
    const { adminDb } = initializeAdmin();
    
    const reposSnap = await adminDb.collection('users').doc(userData.userId).collection('repositories').get();
    
    const repositories = reposSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(repositories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
