'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Github, Search, Star, GitFork, RefreshCw, Loader2, ShieldAlert } from 'lucide-react';
import { useUser } from '@/firebase';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: {
    login: string;
  };
  private: boolean;
}

interface GitHubImportProps {
  onImport: (repo: GitHubRepo) => void;
  isImporting: boolean;
}

export function GitHubImport({ onImport, isImporting }: GitHubImportProps) {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/github/list-repos');
      if (!res.ok) throw new Error('Failed to fetch repositories');
      const data = await res.json();
      setRepos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRepos();
    }
  }, [session]);

  const filteredRepos = repos.filter(repo => 
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 p-6 bg-muted/50 rounded-full border border-dashed border-border">
          <Github className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">Connect GitHub</h3>
        <p className="text-muted-foreground max-w-sm mb-8">
          To see your repositories and import them into DevNest, you need to link your GitHub account.
        </p>
        <Button 
          size="lg" 
          className="bg-[#24292f] text-white hover:bg-[#24292f]/90 px-8"
          onClick={() => signIn('github')}
        >
          <Github className="mr-2 h-5 w-5" />
          Connect GitHub Account
        </Button>
      </div>
    );
  }

  if (status === 'loading' || (session && isLoading && repos.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Fetching your repositories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your repositories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={fetchRepos} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-sm">
          <ShieldAlert className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="space-y-3">
        {filteredRepos.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            No repositories found.
          </div>
        )}
        {filteredRepos.map((repo) => (
          <Card key={repo.id} className="p-4 hover:border-primary/50 transition-colors group">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-500 hover:underline cursor-pointer">
                    {repo.full_name}
                  </span>
                  {repo.private && (
                    <span className="text-[10px] border px-1.5 py-0.5 rounded uppercase font-bold text-muted-foreground">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
                  {repo.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {repo.forks_count}
                  </span>
                  <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => onImport(repo)}
                disabled={isImporting}
                className="bg-green-600 hover:bg-green-700 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Import
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
