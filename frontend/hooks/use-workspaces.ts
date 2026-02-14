import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { WorkspaceSchema } from "@/lib/validators";

export interface Workspace {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export function useWorkspaces() {
  return useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: () => apiClient<Workspace[]>("/workspaces"),
  });
}

export function useWorkspace(id: string) {
  return useQuery<Workspace>({
    queryKey: ["workspaces", id],
    queryFn: () => apiClient<Workspace>(`/workspaces/${id}`),
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspaceSchema) =>
      apiClient<Workspace>("/workspaces", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/workspaces/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
