'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link2, Globe, Lock, ShieldCheck } from 'lucide-react';

interface URLImportProps {
  onImport: (data: { gitUrl: string; newName: string; isPrivate: boolean }) => void;
  isImporting: boolean;
}

export function URLImport({ onImport, isImporting }: URLImportProps) {
  const [gitUrl, setGitUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUrl) return;
    onImport({ gitUrl, newName, isPrivate });
  };

  const extractNameFromUrl = (url: string) => {
    try {
      const parts = url.replace('.git', '').split('/');
      return parts[parts.length - 1] || '';
    } catch {
      return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      <div className="space-y-3">
        <Label htmlFor="git-url" className="text-sm font-bold flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" /> Repository Git URL
        </Label>
        <Input
          id="git-url"
          placeholder="https://github.com/user/repository.git"
          className="h-12 bg-muted/20"
          value={gitUrl}
          onChange={(e) => {
            setGitUrl(e.target.value);
            if (!newName) setNewName(extractNameFromUrl(e.target.value));
          }}
          required
        />
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Supports public GitHub, GitLab, and Bitbucket URLs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="new-name" className="text-sm font-bold">New repository name</Label>
          <Input
            id="new-name"
            placeholder="my-project-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-bold">Visibility</Label>
          <RadioGroup 
            defaultValue="public" 
            onValueChange={(val) => setIsPrivate(val === 'private')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border border-border p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors flex-1">
              <RadioGroupItem value="public" id="r1" />
              <Label htmlFor="r1" className="flex items-center gap-2 cursor-pointer font-medium">
                <Globe className="h-4 w-4" /> Public
              </Label>
            </div>
            <div className="flex items-center space-x-2 border border-border p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors flex-1">
              <RadioGroupItem value="private" id="r2" />
              <Label htmlFor="r2" className="flex items-center gap-2 cursor-pointer font-medium">
                <Lock className="h-4 w-4" /> Private
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-base shadow-lg shadow-blue-500/10"
        disabled={isImporting || !gitUrl}
      >
        Import Repository
      </Button>
    </form>
  );
}
