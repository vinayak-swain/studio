
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
  file: '#3b82f6', // blue
  module: '#22c55e', // green
  issue: '#ef4444', // red
  doc: '#eab308', // yellow
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
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          width: 150,
          textAlign: 'center',
          border: 'none',
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
            style: { stroke: '#94a3b8', strokeWidth: 1 },
            labelStyle: { fill: '#64748b', fontSize: 10, fontWeight: 700 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#94a3b8',
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
      nds.map((node) => ({
        ...node,
        style: {
          ...node.style,
          opacity: val === '' || node.data.label.toLowerCase().includes(val.toLowerCase()) ? 1 : 0.2,
          border: val !== '' && node.data.label.toLowerCase().includes(val.toLowerCase()) ? '2px solid white' : 'none',
        },
      }))
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-muted/5 rounded-lg border overflow-hidden">
      <div className="absolute top-4 left-4 z-10 w-64 space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search nodes..." 
            className="pl-8 bg-background/80 backdrop-blur-sm"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Card className="p-3 bg-background/80 backdrop-blur-sm text-[10px] space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-primary" />
            <span className="font-bold uppercase tracking-wider">Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#3b82f6]" /> File
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#22c55e]" /> Module
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#ef4444]" /> Issue
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#eab308]" /> Doc
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
      >
        <Background color="#ccc" variant="dots" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
