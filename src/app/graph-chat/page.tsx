'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/repository/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Send, User, Bot, Loader2, Sparkles, FileText, AlertCircle, MessageCircle, Share2 } from 'lucide-react';
import { knowledgeGraphChat } from '@/ai/flows/knowledge-graph-chat';
import { GraphVisualizer } from '@/components/graph/graph-visualizer';

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
        content: 'Sorry, I encountered an error while exploring the knowledge graph.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl py-6 px-4 h-[calc(100vh-100px)] flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Knowledge Center</h1>
              <p className="text-muted-foreground text-sm">Explore your codebase architecture and dependencies.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setMessages([])}>
              Reset History
            </Button>
            <Button variant="outline" size="sm" onClick={() => fetch('/api/knowledge-graph/scan', { method: 'POST' })}>
              Refresh Graph
            </Button>
          </div>
        </div>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Graph Visualizer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
            <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-xl">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-6 rounded-full bg-primary/5 p-6 border border-dashed border-primary/20">
                        <Network className="h-12 w-12 text-primary/40" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Ask Insight Bot anything</h3>
                      <p className="text-muted-foreground max-w-sm mt-2 text-sm">
                        I can help you navigate dependencies, find where modules are used, and link issues to your code.
                      </p>
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                        {[
                          'Which files depend on authentication?', 
                          'Where is the logging system used?', 
                          'What issues are related to payments?', 
                          'Which files use the database connection?'
                        ].map((q) => (
                          <Button 
                            key={q} 
                            variant="outline" 
                            size="sm" 
                            className="justify-start h-auto py-3 px-4 text-left text-xs bg-background/50 hover:bg-background border-dashed hover:border-primary/50 transition-all"
                            onClick={() => handleSend(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-4 ${m.role === 'model' ? 'bg-muted/30 p-5 rounded-xl border border-border/50' : 'px-2'}`}>
                      <div className="shrink-0 mt-1">
                        {m.role === 'user' ? (
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {m.role === 'user' ? 'You' : 'Insight Bot'}
                        </p>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                          {m.content}
                        </div>
                        {m.sources && m.sources.length > 0 && (
                          <div className="pt-4 mt-2 border-t border-border/40">
                            <p className="text-[9px] font-bold uppercase text-muted-foreground mb-3 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Linked References
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {m.sources.map((s, idx) => (
                                <button key={idx} className="flex items-center gap-1.5 bg-background/50 hover:bg-accent border border-border/50 px-2.5 py-1.5 rounded-md text-[10px] text-muted-foreground font-mono transition-all hover:text-primary group">
                                  <FileText className="h-3.5 w-3.5 group-hover:text-primary text-muted-foreground/50" />
                                  {s}
                                </button>
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
                  className="flex gap-2 max-w-4xl mx-auto"
                >
                  <Input
                    placeholder="Ask about your project structure..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 h-12 px-6 rounded-full border-muted-foreground/20 focus-visible:ring-primary shadow-inner bg-background/50"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="h-12 w-12 rounded-full p-0 shadow-lg hover:scale-105 transition-transform">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="graph" className="flex-1 m-0">
            <GraphVisualizer />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}