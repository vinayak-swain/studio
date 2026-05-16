'use client';

import React, { useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { 
  useFirestore, 
  useDoc, 
  useCollection, 
  useMemoFirebase,
} from '@/firebase';
import { 
  doc, 
  collection, 
  query, 
  orderBy, 
  limit, 
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';

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
  const [copied, setCopied] = useState(false);

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
    const url = `studio clone ${ownerId}/${repo?.name}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                    <Button className="h-8 bg-green-600 hover:bg-green-700 text-white" size="sm">
                      Add file <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
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
                            {file.path.includes('/') ? <Folder className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <span className="text-sm flex-1 group-hover:text-blue-500">{file.path}</span>
                          <span className="text-xs text-muted-foreground hidden md:block">Update {file.path}</span>
                          <span className="text-xs text-muted-foreground w-24 text-right">Today</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-muted-foreground">
                        <Folder className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No files found in this repository.</p>
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
              <div className="space-y-2">
                <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
                  <div className="bg-blue-500 h-full w-[70%]" />
                  <div className="bg-yellow-500 h-full w-[20%]" />
                  <div className="bg-orange-500 h-full w-[10%]" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <strong>TypeScript</strong> 70.0%
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    <strong>JavaScript</strong> 20.0%
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <strong>HTML</strong> 10.0%
                  </div>
                </div>
              </div>
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
