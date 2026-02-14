"use client";

import { useEffect, useMemo, useCallback } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  ConnectionLineType,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

import { useMindMapStore } from "@/store/use-mindmap-store";
import MindMapNode from "./mind-map-node";
import { MindMapNode as APINode } from "@/hooks/use-ai";
import { ExplanationPanel } from "./explanation-panel";

interface MindMapRendererProps {
  apiNodes: APINode[];
}

// Simple tree layout logic (can be replaced with d3-hierarchy for complex trees)
const layoutNodes = (apiNodes: APINode[]): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const HORIZONTAL_SPACING = 350;
  const VERTICAL_SPACING = 200;

  // Group by parent to help with positioning
  const byParent: Record<string, APINode[]> = {};
  apiNodes.forEach(node => {
    const pid = node.parentId || "root";
    if (!byParent[pid]) byParent[pid] = [];
    byParent[pid].push(node);
  });

  const positionNode = (node: APINode, x: number, y: number) => {
    nodes.push({
      id: node.id,
      type: "mindmap",
      position: { x, y },
      data: { label: node.label, content: node.content },
    });

    const children = byParent[node.id] || [];
    const totalWidth = children.length * HORIZONTAL_SPACING;
    let startX = x - totalWidth / 2 + HORIZONTAL_SPACING / 2;

    children.forEach((child, index) => {
      edges.push({
        id: `e-${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        style: { stroke: "var(--primary)", strokeWidth: 2, opacity: 0.5 },
      });
      positionNode(child, startX + index * HORIZONTAL_SPACING, y + VERTICAL_SPACING);
    });
  };

  const roots = apiNodes.filter(n => !n.parentId);
  roots.forEach((root, i) => positionNode(root, i * 1000, 0));

  return { nodes, edges };
};

export function MindMapRenderer({ apiNodes }: MindMapRendererProps) {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    setNodes, 
    setEdges,
    setSelectedNodeId
  } = useMindMapStore();

  // Memoize nodeTypes to avoid React Flow warning 002
  const nodeTypes = useMemo(() => ({
    mindmap: MindMapNode,
  }), []);

  useEffect(() => {
    const { nodes: flowNodes, edges: flowEdges } = layoutNodes(apiNodes);
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [apiNodes, setNodes, setEdges]);

  // Deselect node when clicking canvas
  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);

  return (
    <div className="w-full h-[600px] border border-border/50 rounded-2xl bg-muted/30 overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        fitView
        className="bg-dot-pattern"
      >
        <Background color="#888" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.1)"
          className="rounded-lg border border-border/50" 
        />
        
        <Panel position="top-right" className="bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border/50 shadow-sm text-xs text-muted-foreground font-medium">
          Interactive Study Graph
        </Panel>
      </ReactFlow>

      <ExplanationPanel />
    </div>
  );
}
