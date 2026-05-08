'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2, Rocket, Brain, Shield, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface ImportStatus {
  step: 'fetching' | 'creating' | 'saving' | 'analyzing' | 'done' | 'error';
  progress: number;
  message: string;
  details?: any;
}

interface ImportProgressProps {
  isOpen: boolean;
  status: ImportStatus;
  error?: string | null;
  onClose: () => void;
}

export function ImportProgress({ isOpen, status, error, onClose }: ImportProgressProps) {
  const router = useRouter();

  const getStepIcon = () => {
    if (status.step === 'error') return <Shield className="h-8 w-8 text-destructive" />;
    if (status.step === 'done') return <CheckCircle2 className="h-8 w-8 text-green-500" />;
    return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && status.step === 'done' && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            {getStepIcon()}
            <DialogTitle className="text-xl font-bold">
              {status.step === 'error' ? 'Import Failed' : status.step === 'done' ? 'Import Complete!' : 'Importing Repository'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-6">
          {status.step !== 'done' && status.step !== 'error' && (
            <div className="space-y-4">
              <Progress value={status.progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground animate-pulse">
                {status.message}
              </p>
            </div>
          )}

          {status.step === 'error' && (
            <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
              <p className="text-sm text-destructive">{error || 'An unexpected error occurred during import.'}</p>
              <Button variant="outline" className="mt-4 w-full" onClick={onClose}>Try Again</Button>
            </div>
          )}

          {status.step === 'done' && status.details && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" /> Project Insight
                  </span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {status.details.aiAnalysis.projectType}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Tech Stack</p>
                    <div className="flex flex-wrap gap-1">
                      {status.details.aiAnalysis.techStack.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Complexity</p>
                    <div className="flex items-center gap-2">
                      <BarChart className="h-3 w-3 text-orange-400" />
                      <span className="text-sm font-bold">{status.details.aiAnalysis.complexityScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Brain className="h-3 w-3" /> AI Summary
                   </p>
                   <p className="text-xs leading-relaxed italic text-foreground/80">
                    "{status.details.aiAnalysis.summary}"
                   </p>
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11"
                onClick={() => router.push(`/dashboard`)}
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
