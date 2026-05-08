'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileArchive, Upload, X, ShieldAlert, CheckCircle } from 'lucide-react';

interface ZipImportProps {
  onImport: (data: { file: File; newName: string; isPrivate: boolean }) => void;
  isImporting: boolean;
}

export function ZipImport({ onImport, isImporting }: ZipImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [newName, setNewName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/zip') {
      setFile(selected);
      if (!newName) setNewName(selected.name.replace('.zip', ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/zip') {
      setFile(dropped);
      if (!newName) setNewName(dropped.name.replace('.zip', ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    onImport({ file, newName, isPrivate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all text-center flex flex-col items-center justify-center gap-4 ${
          file ? 'border-green-500/50 bg-green-500/5' : 'border-border hover:border-primary/50 bg-muted/20'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {file ? (
          <>
            <div className="p-4 bg-green-500/20 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-lg">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 text-muted-foreground"
              onClick={() => setFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="font-bold text-lg">Drop your .zip here</p>
              <p className="text-sm text-muted-foreground">or click to browse from your device</p>
            </div>
            <Input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".zip" 
              onChange={handleFileChange}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Select ZIP File
            </Button>
          </>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="zip-repo-name" className="text-sm font-bold">Repository name</Label>
        <Input
          id="zip-repo-name"
          placeholder="imported-project"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <ShieldAlert className="h-3 w-3" /> Max file size: 10MB. AI analysis will run on extraction.
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-base"
        disabled={isImporting || !file}
      >
        Upload and Import
      </Button>
    </form>
  );
}
