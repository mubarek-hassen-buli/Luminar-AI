import { create } from "zustand";
import { Node, Edge, Connection, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from "reactflow";

interface MindMapState {
  nodes: Node[];
  edges: Edge[];
  expandedNodeIds: Set<string>;
  selectedNodeId: string | null;
  isGenerating: boolean;
  explanation: Record<string, string>; // Maps nodeId to explanation text
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  toggleNodeExpansion: (nodeId: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setExplanation: (nodeId: string, text: string) => void;
  reset: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [],
  edges: [],
  expandedNodeIds: new Set(),
  selectedNodeId: null,
  isGenerating: false,
  explanation: {},

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  toggleNodeExpansion: (nodeId) => {
    set((state) => {
      const newExpanded = new Set(state.expandedNodeIds);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { expandedNodeIds: newExpanded };
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  
  setGenerating: (isGenerating) => set({ isGenerating }),
  
  setExplanation: (nodeId, text) => 
    set((state) => ({
      explanation: { ...state.explanation, [nodeId]: text }
    })),

  reset: () => set({ nodes: [], edges: [], selectedNodeId: null, explanation: {}, isGenerating: false }),
}));
