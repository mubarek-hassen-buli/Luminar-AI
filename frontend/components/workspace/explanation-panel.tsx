"use client";

import { useMindMapStore } from "@/store/use-mindmap-store";
import { useExplanation } from "@/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Brain, Laugh, Film, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ExplanationPanel() {
  const { selectedNodeId, nodes, explanation, setSelectedNodeId } = useMindMapStore();
  const { mutate: getExplanation, isPending } = useExplanation();
  const [style, setStyle] = useState<"funny" | "real-world" | "movie-analogy">("real-world");

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNodeId || !selectedNode) return null;

  const currentExplanation = explanation[selectedNodeId];

  return (
    <div className="absolute top-4 right-4 z-50 w-80 max-h-[calc(100%-2rem)] flex flex-col gap-4 animate-in slide-in-from-right duration-300">
      <Card className="border-border/50 bg-background/90 backdrop-blur-xl shadow-2xl relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
          onClick={() => setSelectedNodeId(null)}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="pb-2 pr-10">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Explanation
          </CardTitle>
          <CardDescription className="text-xs">
            Exploring: {selectedNode.data.label}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={style === "real-world" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-[10px] h-7 gap-1"
              onClick={() => setStyle("real-world")}
            >
              <Brain className="h-3 w-3" />
              Logic
            </Button>
            <Button
              variant={style === "funny" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-[10px] h-7 gap-1"
              onClick={() => setStyle("funny")}
            >
              <Laugh className="h-3 w-3" />
              Funny
            </Button>
            <Button
              variant={style === "movie-analogy" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-[10px] h-7 gap-1"
              onClick={() => setStyle("movie-analogy")}
            >
              <Film className="h-3 w-3" />
              Movie
            </Button>
          </div>

          <div className="min-h-[150px] relative">
            {isPending ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : currentExplanation ? (
              <div className="text-sm text-foreground/90 leading-relaxed animate-in fade-in duration-500 whitespace-pre-wrap">
                {currentExplanation}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Need an explanation? Pick a style above!
                </p>
                <Button 
                  size="sm" 
                  className="w-full text-xs font-semibold"
                  onClick={() => getExplanation({ nodeId: selectedNodeId, style })}
                >
                  Generate Now
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
