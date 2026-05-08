
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { importFromGitHub } from '@/lib/import/github';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { analyzeImportedRepo } from '@/ai/flows/import-analysis';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: 'GitHub session expired or not found' }, { status: 401 });
  }

  const { owner, repo, newName, isPrivate, userId } = await req.json();

  try {
    // 1. Fetch data from GitHub
    const githubData = await importFromGitHub(accessToken, owner, repo);

    // 2. Initialize Firebase
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // 3. AI Analysis on initial content
    // Use snippets for analysis to keep prompt size reasonable
    const sampleFiles = githubData.files.slice(0, 5).map(f => `File: ${f?.path}\n${f?.content?.substring(0, 500)}`).join('\n---\n');
    const aiAnalysis = await analyzeImportedRepo({
      repoName: newName || githubData.repo.name,
      fileCount: githubData.files.length,
      languages: [githubData.repo.language || 'Unknown'],
      sampleContent: sampleFiles
    });

    // 4. Create Repository in Firestore
    const repoRef = await addDoc(collection(db, 'users', userId, 'repositories'), {
      name: newName || githubData.repo.name,
      description: githubData.repo.description || '',
      ownerId: userId,
      isPrivate: !!isPrivate,
      source: 'github',
      githubUrl: githubData.repo.html_url,
      createdAt: serverTimestamp(),
      importAnalysis: aiAnalysis
    });

    return NextResponse.json({ 
      success: true, 
      repoId: repoRef.id,
      fileCount: githubData.files.length,
      aiAnalysis 
    });
  } catch (error: any) {
    console.error('GitHub Import Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
