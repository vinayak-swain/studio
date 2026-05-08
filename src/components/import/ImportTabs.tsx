'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitHubImport } from './GitHubImport';
import { URLImport } from './URLImport';
import { ZipImport } from './ZipImport';
import { ImportProgress, ImportStatus } from './ImportProgress';
import { Github, Link2, FileArchive } from 'lucide-react';
import { useUser } from '@/firebase';

export function ImportTabs() {
  const { user } = useUser();
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    step: 'fetching',
    progress: 0,
    message: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startImport = (message: string) => {
    setIsModalOpen(true);
    setError(null);
    setImportStatus({ step: 'fetching', progress: 10, message });
  };

  const handleGitHubImport = async (repo: any) => {
    if (!user) return;
    startImport(`Fetching ${repo.full_name} from GitHub...`);

    try {
      setImportStatus({ step: 'creating', progress: 40, message: 'Creating DevNest repository...' });
      const res = await fetch('/api/import/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: repo.owner.login,
          repo: repo.name,
          newName: repo.name,
          userId: user.uid,
          isPrivate: repo.private
        }),
      });

      if (!res.ok) throw new Error('GitHub import failed');
      const result = await res.json();

      setImportStatus({ step: 'analyzing', progress: 90, message: 'Running AI architectural analysis...', details: result });
      setImportStatus(prev => ({ ...prev, step: 'done', progress: 100, message: 'Import successful!' }));
    } catch (err: any) {
      setImportStatus({ step: 'error', progress: 0, message: 'Failed' });
      setError(err.message);
    }
  };

  const handleUrlImport = async (data: { gitUrl: string; newName: string; isPrivate: boolean }) => {
    if (!user) return;
    startImport(`Cloning repository from ${data.gitUrl}...`);

    try {
      setImportStatus({ step: 'creating', progress: 30, message: 'Connecting and cloning...' });
      const res = await fetch('/api/import/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user.uid }),
      });

      if (!res.ok) throw new Error('URL import failed');
      const result = await res.json();

      setImportStatus({ step: 'analyzing', progress: 90, message: 'Analyzing project structure...', details: result });
      setImportStatus(prev => ({ ...prev, step: 'done', progress: 100, message: 'Import successful!' }));
    } catch (err: any) {
      setImportStatus({ step: 'error', progress: 0, message: 'Failed' });
      setError(err.message);
    }
  };

  const handleZipImport = async (data: { file: File; newName: string; isPrivate: boolean }) => {
    if (!user) return;
    startImport(`Uploading ${data.file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('newName', data.newName);
      formData.append('isPrivate', String(data.isPrivate));
      formData.append('userId', user.uid);

      setImportStatus({ step: 'creating', progress: 40, message: 'Extracting ZIP contents...' });
      const res = await fetch('/api/import/zip', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('ZIP import failed');
      const result = await res.json();

      setImportStatus({ step: 'analyzing', progress: 90, message: 'Running AI analysis on files...', details: result });
      setImportStatus(prev => ({ ...prev, step: 'done', progress: 100, message: 'Import successful!' }));
    } catch (err: any) {
      setImportStatus({ step: 'error', progress: 0, message: 'Failed' });
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-muted/50 p-1 mb-8">
          <TabsTrigger value="github" className="flex items-center gap-2 font-bold data-[state=active]:bg-card shadow-sm">
            <Github className="h-4 w-4" /> GitHub
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2 font-bold data-[state=active]:bg-card shadow-sm">
            <Link2 className="h-4 w-4" /> Git URL
          </TabsTrigger>
          <TabsTrigger value="zip" className="flex items-center gap-2 font-bold data-[state=active]:bg-card shadow-sm">
            <FileArchive className="h-4 w-4" /> ZIP Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="min-h-[400px]">
          <GitHubImport onImport={handleGitHubImport} isImporting={isModalOpen && importStatus.step !== 'done' && importStatus.step !== 'error'} />
        </TabsContent>
        <TabsContent value="url" className="min-h-[400px]">
          <URLImport onImport={handleUrlImport} isImporting={isModalOpen && importStatus.step !== 'done' && importStatus.step !== 'error'} />
        </TabsContent>
        <TabsContent value="zip" className="min-h-[400px]">
          <ZipImport onImport={handleZipImport} isImporting={isModalOpen && importStatus.step !== 'done' && importStatus.step !== 'error'} />
        </TabsContent>
      </Tabs>

      <ImportProgress 
        isOpen={isModalOpen} 
        status={importStatus} 
        error={error} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
