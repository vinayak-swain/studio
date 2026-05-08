'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Loader2, Search, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface GraphNode {
  id: string;
  type: string;
  label: string;
  relations: { targetId: string; type: string }[];
}

const nodeColors: Record<string, string> = {
  file: '#1f6feb', // primary blue
  module: '#238636', // success green
  issue: '#da3633', // destructive red
  doc: '#d29922', // warning yellow
};

export function GraphVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/knowledge-graph');
      const data: GraphNode[] = await response.json();

      const flowNodes: Node[] = data.map((n, i) => ({
        id: n.id,
        data: { label: n.label, type: n.type },
        position: { x: Math.random() * 800, y: Math.random() * 600 },
        style: { 
          background: nodeColors[n.type] || '#64748b',
          color: '#fff',
          borderRadius: '12px',
          padding: '12px',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: '600',
          width: 160,
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }));

      const flowEdges: Edge[] = [];
      data.forEach((n) => {
        n.relations?.forEach((rel) => {
          flowEdges.push({
            id: `e-${n.id}-${rel.targetId}`,
            source: n.id,
            target: rel.targetId,
            label: rel.type,
            animated: rel.type === 'depends_on',
            style: { stroke: '#30363d', strokeWidth: 1.5 },
            labelStyle: { fill: '#8b949e', fontSize: 9, fontWeight: 700, fontFamily: 'sans-serif' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#30363d',
            },
          });
        });
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSearch = (val: string) => {
    setSearch(val);
    setNodes((nds) =>
      nds.map((node) => {
        const matches = val === '' || node.data.label.toLowerCase().includes(val.toLowerCase());
        return {
          ...node,
          style: {
            ...node.style,
            opacity: matches ? 1 : 0.15,
            border: !matches ? 'none' : (val !== '' ? '2px solid #1f6feb' : '1px solid rgba(255,255,255,0.1)'),
            transform: matches && val !== '' ? 'scale(1.1)' : 'scale(1)',
          },
        };
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[600px] w-full bg-card/50 backdrop-blur-md rounded-xl border border-border shadow-inner overflow-hidden">
      <div className="absolute top-6 left-6 z-10 w-64 space-y-4">
        <div className="relative shadow-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search architecture..." 
            className="pl-10 bg-background/90 border-primary/20 focus:ring-primary rounded-lg h-10"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Card className="p-4 bg-background/95 backdrop-blur-sm shadow-xl border-border/50">
          <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-2">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">Visual Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-1">
            <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(31,111,235,0.5)] bg-[#1f6feb]" /> File
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(35,134,54,0.5)] bg-[#238636]" /> Module
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(218,54,51,0.5)] bg-[#da3633]" /> Issue
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(210,153,34,0.5)] bg-[#d29922]" /> Doc
            </div>
          </div>
        </Card>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
      >
        <Background color="#161b22" variant="dots" gap={20} size={1} />
        <Controls className="fill-foreground bg-background border-border" />
        <MiniMap 
          nodeColor={(n) => (nodeColors[n.data.type] || '#64748b')} 
          maskColor="rgba(0,0,0,0.3)"
          className="bg-background border-border rounded-lg"
          style={{ height: 120 }}
          zoomable 
          pannable 
        />
      </ReactFlow>
    </div>
  );
}