import { NextResponse } from 'next/server';
import { importFromZip } from '@/lib/import/zip';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { analyzeImportedRepo } from '@/ai/flows/import-analysis';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const newName = formData.get('newName') as string;
    const isPrivate = formData.get('isPrivate') === 'true';
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and User ID are required' }, { status: 400 });
    }

    // 1. Read ZIP buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const files = await importFromZip(buffer);

    // 2. Initialize Firebase
    const { firebaseApp } = initializeFirebase();
    const db = getFirestore(firebaseApp);

    // 3. AI Analysis
    const sampleFiles = files.slice(0, 5).map(f => `File: ${f.path}\n${f.content.substring(0, 500)}`).join('\n---\n');
    const aiAnalysis = await analyzeImportedRepo({
      repoName: newName || file.name.replace('.zip', ''),
      fileCount: files.length,
      languages: ['Extracted from ZIP'],
      sampleContent: sampleFiles
    });

    // 4. Create Repository in Firestore
    const repoRef = await addDoc(collection(db, 'users', userId, 'repositories'), {
      name: newName || file.name.replace('.zip', ''),
      description: 'Imported via ZIP upload',
      ownerId: userId,
      isPrivate: !!isPrivate,
      source: 'zip',
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
    console.error('ZIP Import Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
