import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useMindMapStore } from "@/store/use-mindmap-store";

export interface MindMapNode {
  id: string;
  label: string;
  content: string;
  parentId: string | null;
  depth: number;
}

export function useMindMap(workspaceId: string) {
  return useQuery<MindMapNode[]>({
    queryKey: ["mindmap", workspaceId],
    queryFn: () => apiClient<MindMapNode[]>(`/ai/mindmap/${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useGenerateMindMap() {
  const queryClient = useQueryClient();
  const setGenerating = useMindMapStore((state) => state.setGenerating);

  return useMutation({
    mutationFn: (workspaceId: string) => {
      setGenerating(true);
      return apiClient(`/ai/mindmap/${workspaceId}`, { method: "POST" });
    },
    onSuccess: (_, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ["mindmap", workspaceId] });
      toast.success("Mind map generated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate mind map");
    },
    onSettled: () => {
      setGenerating(false);
    },
  });
}

export function useExplanation() {
  const setExplanation = useMindMapStore((state) => state.setExplanation);

  return useMutation({
    mutationFn: ({ nodeId, style }: { nodeId: string; style: string }) =>
      apiClient<{ explanation: string }>(`/ai/explanation/${nodeId}?style=${style}`),
    onSuccess: (data, { nodeId }) => {
      setExplanation(nodeId, data.explanation);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to get explanation");
    },
  });
}
