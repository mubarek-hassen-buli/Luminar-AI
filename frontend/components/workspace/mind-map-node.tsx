import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMindMapStore } from "@/store/use-mindmap-store";
import { ChevronDown, ChevronRight } from "lucide-react";

const MindMapNode = ({ id, data, selected }: NodeProps) => {
  const setSelectedNodeId = useMindMapStore((state) => state.setSelectedNodeId);
  const toggleNodeExpansion = useMindMapStore((state) => state.toggleNodeExpansion);

  const hasChildren = data.hasChildren;
  const isExpanded = data.isExpanded;

  return (
    <div 
      className={cn(
        "transition-all duration-300 transform",
        selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl" : ""
      )}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-0 !p-0" />
      
      <Card 
        className={cn(
          "min-w-[220px] max-w-[320px] border-border/50 bg-background/80 backdrop-blur-md shadow-xl cursor-pointer hover:border-primary/30 transition-colors",
          selected ? "border-primary/50 bg-primary/5" : ""
        )}
        onClick={() => setSelectedNodeId(id)}
      >
        <CardHeader className="p-4 py-3 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold truncate">
            {data.label}
          </CardTitle>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(id);
              }}
              className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </CardHeader>
        {data.content && (
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {data.content}
            </p>
          </CardContent>
        )}
      </Card>

      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-0 !p-0" />
    </div>
  );
};

export default memo(MindMapNode);
