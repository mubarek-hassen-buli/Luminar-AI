"use client";

import { use } from "react";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useMindMap } from "@/hooks/use-ai";
import { MindMapRenderer } from "@/components/workspace/mind-map-renderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Brain } from "lucide-react";
import Link from "next/link";

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(id);
  const { data: mindMapNodes, isLoading: isLoadingMindMap } = useMindMap(id);

  if (isLoadingWorkspace || isLoadingMindMap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Entering Study Canvas...</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Workspace not found</h1>
        <Link href="/workspaces">
          <Button variant="link">Back to workspaces</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Canvas Header */}
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between bg-card/30 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link href={`/workspaces/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-[1px] bg-border/50" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{workspace.title}</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Study Canvas</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {mindMapNodes && mindMapNodes.length > 0 ? (
          <MindMapRenderer 
            apiNodes={mindMapNodes} 
            className="border-0 rounded-0 rounded-none h-full bg-transparent" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
             <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
               <Brain className="w-8 h-8 text-primary/40" />
             </div>
             <h2 className="text-lg font-medium mb-2">No mind map generated</h2>
             <p className="text-sm text-muted-foreground max-w-xs mb-6">
                Go back to the workspace dashboard to generate a study map from your materials.
             </p>
             <Link href={`/workspaces/${id}`}>
               <Button>Go to Dashboard</Button>
             </Link>
          </div>
        )}
      </main>
    </div>
  );
}
