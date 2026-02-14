import { db } from "../config/drizzle";
import { materials, workspaces } from "../db/schema";
import { eq, count } from "drizzle-orm";
import { uploadStream } from "../cloudinary/cloudinary";
import { EmbeddingService } from "../embeddings/embedding.service";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { v4 as uuidv4 } from "uuid";

export class MaterialService {
  static async extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      return data.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const data = await mammoth.extractRawText({ buffer });
      return data.value;
    }
    throw new Error("Unsupported file type for text extraction.");
  }

  static async uploadMaterial(workspaceId: string, file: any) {
    // 1. Enforce 1-material-per-workspace limit for free tier
    const [materialCount] = await db
      .select({ count: count() })
      .from(materials)
      .where(eq(materials.workspaceId, workspaceId));

    if (materialCount.count >= 1) {
      throw new Error("Free tier limit reached: Maximum 1 material allowed per workspace.");
    }

    // 2. Extract text locally before uploading to Cloudinary
    const textContent = await this.extractTextFromBuffer(file.buffer, file.mimetype);

    // 3. Upload to Cloudinary
    const uploadResult = await uploadStream(file.buffer, `workspaces/${workspaceId}`);

    // 4. Save to database
    const [insertedMaterial] = await db
      .insert(materials)
      .values({
        id: uuidv4(),
        workspaceId,
        originalFileName: file.originalname,
        cloudinaryUrl: uploadResult.secure_url,
        extractedText: textContent,
      })
      .returning();

    // 5. Generate embeddings for RAG
    // Note: In production, this should likely be a background job
    try {
      await EmbeddingService.processMaterial(insertedMaterial.id, textContent);
    } catch (error) {
      console.error("Failed to generate embeddings:", error);
      // We don't throw here to avoid failing the upload if extraction/upload succeeded
    }

    return insertedMaterial;
  }

  static async listMaterials(workspaceId: string) {
    return await db.select().from(materials).where(eq(materials.workspaceId, workspaceId));
  }

  static async deleteMaterial(materialId: string) {
    return await db.delete(materials).where(eq(materials.id, materialId)).returning();
  }
}
