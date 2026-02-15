import dagre from "dagre";
import { useEffect, useMemo, useCallback, useRef } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  ConnectionLineType,
  Panel,
  useReactFlow,
  ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";

import { useMindMapStore } from "@/store/use-mindmap-store";
import MindMapNode from "./mind-map-node";
import { MindMapNode as APINode } from "@/hooks/use-ai";
import { ExplanationPanel } from "./explanation-panel";
import { cn } from "@/lib/utils";

interface MindMapRendererProps {
  apiNodes: APINode[];
  className?: string;
}

const nodeWidth = 250;
const nodeHeight = 150;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const updatedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    } as Node;
  });

  return { nodes: updatedNodes, edges };
};

function FlowInner({ apiNodes }: { apiNodes: APINode[] }) {
  const { 
    nodes, 
    edges, 
    expandedNodeIds,
    onNodesChange, 
    onEdgesChange, 
    setNodes, 
    setEdges,
    setSelectedNodeId
  } = useMindMapStore();

  const { fitView } = useReactFlow();
  const isInitialLoad = useRef(true);

  const nodeTypes = useMemo(() => ({
    mindmap: MindMapNode,
  }), []);

  // 1. Initial Root Expansion
  useEffect(() => {
    if (apiNodes.length > 0 && expandedNodeIds.size === 0) {
      const roots = apiNodes.filter(n => !n.parentId);
      roots.forEach(root => {
        if (!expandedNodeIds.has(root.id)) {
          useMindMapStore.getState().toggleNodeExpansion(root.id);
        }
      });
    }
  }, [apiNodes]);

  // 2. Layout & Visibility Logic
  useEffect(() => {
    if (!apiNodes.length) return;

    const visibleNodesSet = new Set<string>();
    const roots = apiNodes.filter(n => !n.parentId);
    
    const collectVisible = (node: APINode) => {
      visibleNodesSet.add(node.id);
      if (expandedNodeIds.has(node.id)) {
        const children = apiNodes.filter(n => n.parentId === node.id);
        children.forEach(collectVisible);
      }
    };

    roots.forEach(collectVisible);

    const flowNodes: Node[] = apiNodes
      .filter(n => visibleNodesSet.has(n.id))
      .map(n => ({
        id: n.id,
        type: "mindmap",
        data: { 
          label: n.label, 
          content: n.content,
          hasChildren: apiNodes.some(child => child.parentId === n.id),
          isExpanded: expandedNodeIds.has(n.id)
        },
        position: { x: 0, y: 0 },
      }));

    const flowEdges: Edge[] = [];
    apiNodes.forEach(child => {
      if (child.parentId && visibleNodesSet.has(child.id) && visibleNodesSet.has(child.parentId)) {
        flowEdges.push({
          id: `e-${child.parentId}-${child.id}`,
          source: child.parentId,
          target: child.id,
          type: ConnectionLineType.SmoothStep,
          animated: true,
          style: { stroke: "var(--primary)", strokeWidth: 2, opacity: 0.5 },
        });
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowNodes, flowEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // 3. Auto-fit view after layout settle
    // We use a small timeout to ensure React Flow has rendered the new nodes
    setTimeout(() => {
      fitView({ duration: 600, padding: 0.2 });
    }, 50);

  }, [apiNodes, expandedNodeIds, setNodes, setEdges, fitView]);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onPaneClick={onPaneClick}
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
  );
}

export function MindMapRenderer({ apiNodes, className }: MindMapRendererProps) {
  return (
    <div className={cn("w-full border border-border/50 rounded-2xl bg-muted/30 overflow-hidden relative", className)}>
      <ReactFlowProvider>
        <FlowInner apiNodes={apiNodes} />
        <ExplanationPanel />
      </ReactFlowProvider>
    </div>
  );
}
