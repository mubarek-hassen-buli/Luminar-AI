import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMindMapStore } from "@/store/use-mindmap-store";

const MindMapNode = ({ id, data, selected }: NodeProps) => {
  const setSelectedNodeId = useMindMapStore((state) => state.setSelectedNodeId);

  return (
    <div 
      className={cn(
        "transition-all duration-300 transform hover:scale-105",
        selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl" : ""
      )}
      onClick={() => setSelectedNodeId(id)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <Card className={cn(
        "min-w-[200px] max-w-[300px] border-border/50 bg-background/80 backdrop-blur-md shadow-xl",
        selected ? "border-primary/50 bg-primary/5" : ""
      )}>
        <CardHeader className="p-4 py-2">
          <CardTitle className="text-sm font-bold truncate">
            {data.label}
          </CardTitle>
        </CardHeader>
        {data.content && (
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground line-clamp-3">
              {data.content}
            </p>
          </CardContent>
        )}
      </Card>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

export default memo(MindMapNode);
