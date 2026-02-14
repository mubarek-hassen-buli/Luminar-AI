import { create } from "zustand";
import { Node, Edge, Connection, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from "reactflow";

interface MindMapState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isGenerating: boolean;
  explanation: Record<string, string>; // Maps nodeId to explanation text
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setSelectedNodeId: (id: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setExplanation: (nodeId: string, text: string) => void;
  reset: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [],
  edges: [],
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

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  
  setGenerating: (isGenerating) => set({ isGenerating }),
  
  setExplanation: (nodeId, text) => 
    set((state) => ({
      explanation: { ...state.explanation, [nodeId]: text }
    })),

  reset: () => set({ nodes: [], edges: [], selectedNodeId: null, explanation: {}, isGenerating: false }),
}));
