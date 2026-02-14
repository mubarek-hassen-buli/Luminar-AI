import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { MaterialService } from "../services/material.service";
import { UsageService } from "../services/usage.service";
import { AppEnv } from "../middleware/validation";

const materials = new Hono<AppEnv>();

materials.use("*", authMiddleware);

// Handle file upload
materials.post("/upload/:workspaceId", async (c) => {
  const workspaceId = c.req.param("workspaceId");
  
  // Enforce free tier limit
  if (!(await UsageService.canUploadMaterial(workspaceId))) {
    return c.json({ error: "Free tier limit reached: Max 1 material per workspace." }, 403);
  }
  
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as any;

    if (!file || !file.name) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    // Adapt Hono file object to what MaterialService expects
    const adaptedFile = {
      buffer: Buffer.from(await file.arrayBuffer()),
      originalname: file.name,
      mimetype: file.type,
    };

    const newMaterial = await MaterialService.uploadMaterial(workspaceId, adaptedFile);
    return c.json(newMaterial, 201);
  } catch (error: any) {
    console.error("Upload error:", error);
    return c.json({ error: error.message }, 400);
  }
});

materials.get("/:workspaceId", async (c) => {
  const workspaceId = c.req.param("workspaceId");
  const list = await MaterialService.listMaterials(workspaceId);
  return c.json(list);
});

materials.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deleted = await MaterialService.deleteMaterial(id);
  return c.json(deleted);
});

export default materials;
