"use client";

import { use } from "react";
import { useWorkspace } from "@/hooks/use-workspaces";
import { useMaterials, useDeleteMaterial } from "@/hooks/use-materials";
import { UploadZone } from "@/components/workspace/upload-zone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, Brain, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(id);
  const { data: materials, isLoading: isLoadingMaterials } = useMaterials(id);
  const deleteMutation = useDeleteMaterial();

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
          <Button disabled={!materials?.length}>
            <Brain className="mr-2 h-4 w-4" />
            Generate Mind Map
          </Button>
        </div>
      </div>

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
  );
}
