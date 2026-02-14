"use client";

import { use } from "react";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useMaterials, useDeleteMaterial } from "@/hooks/use-materials";
import { UploadZone } from "@/components/workspace/upload-zone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, Brain, ArrowLeft, Loader2, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useMindMap, useGenerateMindMap } from "@/hooks/use-ai";
import { useMindMapStore } from "@/store/use-mindmap-store";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(id);
  const { data: materials, isLoading: isLoadingMaterials } = useMaterials(id);
  const { data: mindMapNodes, isLoading: isLoadingMindMap } = useMindMap(id);
  
  const generateMindMap = useGenerateMindMap();
  const deleteMutation = useDeleteMaterial();
  const { isGenerating } = useMindMapStore();

  // Redirect to canvas on successful generation
  const handleGenerate = async () => {
    try {
      await generateMindMap.mutateAsync(id);
      router.push(`/workspaces/${id}/canvas`);
    } catch (e) {
      // Error handled by mutation toast
    }
  };

  if (isLoadingWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/workspaces" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Workspaces
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{workspace.title}</h1>
          <p className="text-muted-foreground">{workspace.description || "No description provided."}</p>
        </div>
        <div className="flex gap-2">
          {mindMapNodes && mindMapNodes.length > 0 && (
            <Link href={`/workspaces/${id}/canvas`}>
              <Button variant="outline" className="gap-2">
                <Brain className="w-4 h-4" />
                Open Canvas
              </Button>
            </Link>
          )}
          <Button 
            disabled={!materials?.length || generateMindMap.isPending || isGenerating}
            onClick={handleGenerate}
            className="relative overflow-hidden group"
          >
            {(generateMindMap.isPending || isGenerating) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
            )}
            {mindMapNodes?.length ? "Regenerate Study Map" : "Generate Study Map"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Mind Map Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Study Canvas
            </h2>
          </div>

          {isLoadingMindMap ? (
            <div className="w-full h-48 border border-border/50 rounded-2xl bg-muted/20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse">Checking for study maps...</p>
            </div>
          ) : mindMapNodes && mindMapNodes.length > 0 ? (
            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative group cursor-pointer hover:bg-primary/10 transition-colors">
              <Link href={`/workspaces/${id}/canvas`} className="absolute inset-0 z-10" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  Graph Ready for Exploration!
                </CardTitle>
                <CardDescription>
                  Your interactive study map is active. Jump in to get AI-powered explanations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="group-hover:translate-x-1 transition-transform">
                  Enter Infinite Canvas <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-muted/30 border-dashed py-12">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary/40" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-medium">No Study Map yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Upload your study materials and click "Generate Study Map" to enter your visual learning canvas.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Materials
              </h2>
              
              <div className="grid gap-4">
                {isLoadingMaterials ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : materials?.length === 0 ? (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No academic materials uploaded yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  materials?.map((material) => (
                    <Card key={material.id} className="group overflow-hidden">
                      <div className="flex items-center p-4 gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{material.originalFileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {format(new Date(material.createdAt), "PPP")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a href={material.cloudinaryUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-destructive transition-colors"
                            onClick={() => deleteMutation.mutate(material.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Add Material</h2>
              <UploadZone workspaceId={id} />
              <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
                **Free Tier Notice:** You can upload 1 academic material per workspace. 
                The AI will extract text from your PDF or DOCX to generate mind maps and explanations.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
