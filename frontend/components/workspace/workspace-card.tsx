import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Workspace } from "@/hooks/use-workspaces";
import { format } from "date-fns";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link href={`/workspaces/${workspace.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full group">
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">
            {workspace.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {workspace.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Created on {format(new Date(workspace.createdAt), "PPP")}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
