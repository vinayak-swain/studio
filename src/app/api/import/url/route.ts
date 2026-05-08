import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { importFromUrl } from '@/lib/import/url';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { analyzeImportedRepo } from '@/ai/flows/import-analysis';

export async function POST(req: Request) {
  const { gitUrl, newName, isPrivate, userId } = await req.json();

  if (!gitUrl) {
    return NextResponse.json({ error: 'Git URL is required' }, { status: 400 });
  }

  try {
    // 1. Clone and extract files
    const files = await importFromUrl(gitUrl);

    // 2. Initialize Firebase
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // 3. AI Analysis
    const sampleFiles = files.slice(0, 5).map(f => `File: ${f.path}\n${f.content.substring(0, 500)}`).join('\n---\n');
    const aiAnalysis = await analyzeImportedRepo({
      repoName: newName || 'Imported Repo',
      fileCount: files.length,
      languages: ['Detected'], // Simplified for prototype
      sampleContent: sampleFiles
    });

    // 4. Create Repository in Firestore
    const repoRef = await addDoc(collection(db, 'users', userId, 'repositories'), {
      name: newName || 'Imported Repo',
      description: `Imported from ${gitUrl}`,
      ownerId: userId,
      isPrivate: !!isPrivate,
      source: 'url',
      gitUrl,
      createdAt: serverTimestamp(),
      importAnalysis: aiAnalysis
    });

    return NextResponse.json({ 
      success: true, 
      repoId: repoRef.id,
      fileCount: files.length,
      aiAnalysis 
    });
  } catch (error: any) {
    console.error('URL Import Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
