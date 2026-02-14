import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export interface Material {
  id: string;
  workspaceId: string;
  originalFileName: string;
  cloudinaryUrl: string;
  extractedText: string;
  createdAt: string;
}

export function useMaterials(workspaceId: string) {
  return useQuery<Material[]>({
    queryKey: ["materials", workspaceId],
    queryFn: () => apiClient<Material[]>(`/materials/${workspaceId}`),
    enabled: !!workspaceId,
  });
}

export function useUploadMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, file }: { workspaceId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      // Note: apiClient automatically handles Content-Type for JSON. 
      // For FormData, we must let the browser set the boundary by passing undefined.
      return apiClient<any>(`/materials/upload/${workspaceId}`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["materials", variables.workspaceId] });
      toast.success("Material uploaded successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: string) => 
      apiClient(`/materials/${materialId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material deleted");
    },
  });
}
