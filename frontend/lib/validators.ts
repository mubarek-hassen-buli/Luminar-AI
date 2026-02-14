import { z } from "zod";

export const workspaceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export type WorkspaceSchema = z.infer<typeof workspaceSchema>;
