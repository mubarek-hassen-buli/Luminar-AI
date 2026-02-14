import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Material {
  id: string;
  workspaceId: string;
  originalFileName: string;
  cloudinaryUrl: string;
  extractedText: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useMaterials(workspaceId: string) {
  return useQuery<Material[]>({
    queryKey: ["materials", workspaceId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/materials/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("better-auth.session-token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch materials");
      return res.json();
    },
    enabled: !!workspaceId,
  });
}

export function useUploadMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, file }: { workspaceId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/materials/upload/${workspaceId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("better-auth.session-token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload material");
      }

      return res.json();
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
    mutationFn: async (materialId: string) => {
      const res = await fetch(`${API_URL}/api/materials/${materialId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("better-auth.session-token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete material");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material deleted");
    },
  });
}
