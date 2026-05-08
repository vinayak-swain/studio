'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Network, Send, User, Bot, Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { knowledgeGraphChat } from '@/ai/flows/knowledge-graph-chat';

interface Message {
  role: 'user' | 'model';
  content: string;
  sources?: string[];
}

export default function GraphChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const queryText = overrideInput || input;
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await knowledgeGraphChat({ 
        query: queryText,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      
      const botMessage: Message = { 
        role: 'model', 
        content: result.answer,
        sources: result.sources
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = { 
        role: 'model', 
        content: 'Sorry, I encountered an error while exploring the knowledge graph. Make sure your environment is configured correctly.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl py-8 px-4 h-[calc(100vh-140px)] flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Insight Bot</h1>
              <p className="text-muted-foreground text-sm">Trace dependencies and link issues to your code.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            Clear Chat
          </Button>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/30 px-6 py-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Architecture Explorer
            </CardTitle>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Network className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold">Ready to analyze DevNest</h3>
                  <p className="text-muted-foreground max-w-sm mt-2">
                    Ask me about how files connect, which modules use specific dependencies, or which issues affect certain files.
                  </p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    {[
                      'Which files depend on auth?', 
                      'What issues relate to the login page?', 
                      'Where is the firestore instance used?', 
                      'Show me modules that depend on Genkit'
                    ].map((q) => (
                      <Button 
                        key={q} 
                        variant="outline" 
                        size="sm" 
                        className="justify-start h-auto py-2 text-left text-xs"
                        onClick={() => handleSend(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'model' ? 'bg-muted/30 p-4 rounded-lg' : ''}`}>
                  <div className="shrink-0">
                    {m.role === 'user' ? (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {m.role === 'user' ? 'You' : 'Insight Bot'}
                    </p>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="pt-3">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> References
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-background border px-2 py-1 rounded text-[10px] text-muted-foreground font-mono">
                              <FileText className="h-3 w-3" />
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/10">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask about dependencies, usage, or issues..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
