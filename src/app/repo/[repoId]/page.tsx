'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { 
  useFirestore, 
  useDoc, 
  useCollection, 
  useMemoFirebase,
  useUser,
} from '@/firebase';
import { 
  doc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { 
  Book, 
  Star, 
  GitFork, 
  Eye, 
  ChevronDown, 
  Code, 
  FileText, 
  Folder, 
  Info,
  Copy,
  Check,
  Plus,
  FileCode,
  FileJson,
  FileBox,
  FilePlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';
import { calculateLanguageStats, getLanguageByPath } from '@/lib/languages';

interface Repository {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: any;
  stars?: number;
  forks?: number;
  watchers?: number;
  isPrivate?: boolean;
  defaultBranch?: string;
  githubUrl?: string;
}

interface RepoFile {
  id: string;
  path: string;
  content: string;
  updatedAt: any;
}

interface Commit {
  id: string;
  message: string;
  author: string;
  createdAt: any;
  hash: string;
}

function RepositoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const repoId = params.repoId as string;
  const ownerId = searchParams.get('owner');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [copied, setCopied] = useState(false);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [isSavingFile, setIsSavingFile] = useState(false);

  // Memoized Repo Reference
  const repoDocRef = useMemoFirebase(() => {
    if (!firestore || !repoId || !ownerId) return null;
    return doc(firestore, 'users', ownerId, 'repositories', repoId);
  }, [firestore, repoId, ownerId]);

  const { data: repo, isLoading: isRepoLoading } = useDoc<Repository>(repoDocRef);

  // Files Collection
  const filesQuery = useMemoFirebase(() => {
    if (!firestore || !repoDocRef) return null;
    return collection(repoDocRef, 'files');
  }, [firestore, repoDocRef]);

  const { data: files, isLoading: isFilesLoading } = useCollection<RepoFile>(filesQuery);

  // Commits Collection
  const commitsQuery = useMemoFirebase(() => {
    if (!firestore || !repoDocRef) return null;
    return query(collection(repoDocRef, 'commits'), orderBy('createdAt', 'desc'), limit(10));
  }, [firestore, repoDocRef]);

  const { data: commits, isLoading: isCommitsLoading } = useCollection<Commit>(commitsQuery);

  const copyCloneUrl = () => {
    const url = `https://devnext.app/repo/${ownerId}/${repo?.name}.git`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'Repository clone URL copied.',
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy to clipboard.',
      });
    });
  };

  const handleAddFile = async () => {
    if (!repoDocRef || !user || !newFilePath.trim()) return;

    setIsSavingFile(true);
    try {
      const fileId = newFilePath.replace(/\//g, '_');
      const fileRef = doc(repoDocRef, 'files', fileId);
      
      // 1. Create the file
      await setDoc(fileRef, {
        path: newFilePath,
        content: newFileContent,
        updatedAt: serverTimestamp(),
      });

      // 2. Create a commit
      await addDoc(collection(repoDocRef, 'commits'), {
        message: `Create ${newFilePath}`,
        author: user.displayName || user.email || 'User',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        hash: Math.random().toString(36).substring(2, 10),
      });

      toast({
        title: 'File created',
        description: `${newFilePath} has been added to the repository.`,
      });
      
      setIsAddFileOpen(false);
      setNewFilePath('');
      setNewFileContent('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not create file.',
      });
    } finally {
      setIsSavingFile(false);
    }
  };

  const langStats = useMemo(() => {
    return calculateLanguageStats(files || []);
  }, [files]);

  const getFileIcon = (path: string) => {
    const lang = getLanguageByPath(path);
    if (path.includes('/')) return <Folder className="h-4 w-4 text-blue-400" />;
    if (lang?.name === 'TypeScript' || lang?.name === 'JavaScript') return <FileCode className="h-4 w-4 text-yellow-500" />;
    if (lang?.name === 'JSON') return <FileJson className="h-4 w-4 text-orange-400" />;
    if (lang?.name === 'Markdown') return <FileText className="h-4 w-4 text-muted-foreground" />;
    return <FileBox className="h-4 w-4 text-muted-foreground" />;
  };

  if (isRepoLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Repository not found</h1>
          <p className="text-muted-foreground">The repository you are looking for does not exist or you don't have access.</p>
          <Button asChild className="mt-4" variant="outline">
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  const readmeFile = files?.find(f => f.path.toLowerCase() === 'readme.md');

  return (
    <>
      <div className="bg-background border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Book className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-1.5 text-lg font-semibold">
                <span className="text-blue-500 hover:underline cursor-pointer">{ownerId}</span>
                <span className="text-muted-foreground">/</span>
                <span className="hover:underline cursor-pointer">{repo.name}</span>
                <Badge variant="outline" className="ml-2 rounded-full font-normal">
                  {repo.isPrivate ? 'Private' : 'Public'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Star className="h-4 w-4" /> Star <Badge variant="secondary" className="ml-1 h-5 px-1 min-w-4 text-[10px]">{repo.stars || 0}</Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <GitFork className="h-4 w-4" /> Fork <Badge variant="secondary" className="ml-1 h-5 px-1 min-w-4 text-[10px]">{repo.forks || 0}</Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Eye className="h-4 w-4" /> Watch
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="code">
              <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6">
                <TabsTrigger value="code" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 py-2 gap-2">
                  <Code className="h-4 w-4" /> Code
                </TabsTrigger>
                <TabsTrigger value="issues" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 py-2 gap-2">
                  <Info className="h-4 w-4" /> Issues
                </TabsTrigger>
                <TabsTrigger value="pulls" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none bg-transparent px-0 py-2 gap-2">
                  <GitFork className="h-4 w-4" /> Pull requests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-2 bg-muted/50">
                      <GitFork className="h-3 w-3" /> {repo.defaultBranch || 'main'} <ChevronDown className="h-3 w-3" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      <strong className="text-foreground">{files?.length || 0}</strong> files
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-2" onClick={copyCloneUrl}>
                      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      Clone
                    </Button>
                    
                    <Dialog open={isAddFileOpen} onOpenChange={setIsAddFileOpen}>
                      <DialogTrigger asChild>
                        <Button className="h-8 bg-green-600 hover:bg-green-700 text-white" size="sm">
                          Add file <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Create new file</DialogTitle>
                          <DialogDescription>
                            Create a new file in the root of your repository.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="path">File name (with extension)</Label>
                            <Input
                              id="path"
                              placeholder="e.g. index.ts"
                              value={newFilePath}
                              onChange={(e) => setNewFilePath(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                              id="content"
                              placeholder="Type your code here..."
                              className="min-h-[200px] font-mono text-xs"
                              value={newFileContent}
                              onChange={(e) => setNewFileContent(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddFileOpen(false)}>Cancel</Button>
                          <Button 
                            className="bg-green-600 hover:bg-green-700 text-white" 
                            onClick={handleAddFile}
                            disabled={isSavingFile || !newFilePath.trim()}
                          >
                            {isSavingFile ? 'Saving...' : 'Create file'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <div className="bg-muted/30 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] font-bold">U</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{commits?.[0]?.author || 'User'}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-md">{commits?.[0]?.message || 'Initial commit'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{commits?.[0]?.hash?.substring(0,7) || 'abc1234'}</span>
                      <span>{commits?.[0]?.createdAt ? formatDistanceToNow(commits[0].createdAt.toDate()) + ' ago' : 'Recently'}</span>
                    </div>
                  </div>
                  <div className="divide-y">
                    {isFilesLoading ? (
                      [1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)
                    ) : files && files.length > 0 ? (
                      files.map(file => (
                        <div key={file.id} className="p-3 flex items-center hover:bg-muted/30 transition-colors group cursor-pointer">
                          <div className="w-8 shrink-0">
                            {getFileIcon(file.path)}
                          </div>
                          <span className="text-sm flex-1 group-hover:text-blue-500">{file.path}</span>
                          <span className="text-xs text-muted-foreground hidden md:block">Update {file.path}</span>
                          <span className="text-xs text-muted-foreground w-24 text-right">
                            {file.updatedAt ? formatDistanceToNow(file.updatedAt.toDate()) + ' ago' : 'Today'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-muted-foreground">
                        <FilePlus className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-semibold text-foreground">Repository is empty</p>
                        <p className="text-sm mt-1">Add your first file to get started.</p>
                      </div>
                    )}
                  </div>
                </div>

                {readmeFile && (
                  <Card className="mt-8">
                    <CardHeader className="py-3 border-b bg-muted/20">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Book className="h-4 w-4 text-muted-foreground" /> README.md
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 prose dark:prose-invert max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {readmeFile.content}
                      </ReactMarkdown>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">About</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {repo.description || 'No description, website, or topics provided.'}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" /> <strong>{repo.stars || 0}</strong> stars
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" /> <strong>{repo.watchers || 0}</strong> watching
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitFork className="h-4 w-4" /> <strong>{repo.forks || 0}</strong> forks
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Languages</h3>
              {langStats.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
                    {langStats.map((stat, i) => (
                      <div 
                        key={i} 
                        className={stat.color} 
                        style={{ width: `${stat.percentage}%` }} 
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {langStats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span className={`h-2 w-2 rounded-full ${stat.color}`} />
                        <strong>{stat.name}</strong> {stat.percentage}%
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No languages detected yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RepositoryPage() {
  return (
    <DashboardLayout>
      <RepositoryPageContent />
    </DashboardLayout>
  );
}
