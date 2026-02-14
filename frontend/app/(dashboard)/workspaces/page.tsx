"use client";

import { useWorkspaces } from "@/hooks/use-workspaces";
import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { Loader2, LayoutGrid } from "lucide-react";

export default function WorkspacesPage() {
  const { data: workspaces, isLoading } = useWorkspaces();

  const isLimitReached = workspaces ? workspaces.length >= 3 : false;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading your workspaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            {workspaces?.length === 0 
              ? "Get started by creating your first academic workspace." 
              : `Manage your study materials across ${workspaces?.length} ${workspaces?.length === 1 ? 'workspace' : 'workspaces'}.`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <CreateWorkspaceDialog disabled={isLimitReached} />
          {isLimitReached && (
            <p className="text-[10px] text-destructive font-medium uppercase tracking-wider">
              Free Tier Limit Reached (3/3)
            </p>
          )}
        </div>
      </div>

      {workspaces?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-2xl border-2 border-dashed border-muted shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No workspaces yet</h3>
          <p className="text-muted-foreground max-w-[280px] text-center mt-2 mb-6">
            Workspaces help you organize your class materials and generate focused mind maps.
          </p>
          <CreateWorkspaceDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces?.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
