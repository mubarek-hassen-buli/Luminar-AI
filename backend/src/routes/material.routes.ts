import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { MaterialService } from "../services/material.service";
import multer from "multer";
import { AppEnv } from "../middleware/validation";

const materials = new Hono<AppEnv>();

// Multer setup to store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

materials.use("*", authMiddleware);

// Handle file upload
materials.post("/upload/:workspaceId", async (c) => {
  const workspaceId = c.req.param("workspaceId");
  
  // Hono doesn't natively support multer as middleware in the same way Express does
  // We'll use a manual wrapper or rely on c.req.parseBody for simpler cases
  // However, for Buffer access we need multipart/form-data handling.
  
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as any;

    if (!file || !file.name) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    // Adapt Hono file object to what MaterialService expects (similar to Multer's file object)
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
