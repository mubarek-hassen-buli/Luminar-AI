import { pgTable, text, timestamp, boolean, integer, vector, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("workspace_user_id_idx").on(table.userId),
}));

export const materials = pgTable("materials", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  originalFileName: text("original_file_name").notNull(),
  cloudinaryUrl: text("cloudinary_url").notNull(),
  extractedText: text("extracted_text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  workspaceIdIdx: index("material_workspace_id_idx").on(table.workspaceId),
}));

export const mindmap_nodes = pgTable("mindmap_nodes", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  parentId: text("parent_id"), // Can be null for root nodes
  label: text("label").notNull(),
  content: text("content"),
  depth: integer("depth").notNull().default(0),
  order: integer("order").notNull().default(0),
}, (table) => ({
  workspaceIdIdx: index("node_workspace_id_idx").on(table.workspaceId),
  parentIdIdx: index("node_parent_id_idx").on(table.parentId),
}));

export const embeddings = pgTable("embeddings", {
  id: text("id").primaryKey(),
  materialId: text("material_id")
    .notNull()
    .references(() => materials.id),
  chunkText: text("chunk_text").notNull(),
  embedding: vector("embedding", { dimensions: 768 }),
  chunkIndex: integer("chunk_index").notNull(),
}, (table) => ({
  materialIdIdx: index("embedding_material_id_idx").on(table.materialId),
}));

export const ai_requests_log = pgTable("ai_requests_log", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  requestType: text("request_type").notNull(), // e.g., 'mindmap_gen', 'explanation'
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  workspaces: many(workspaces),
  sessions: many(session),
  accounts: many(account),
}));

export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
  user: one(user, { fields: [workspaces.userId], references: [user.id] }),
  materials: many(materials),
  mindmapNodes: many(mindmap_nodes),
}));

export const materialRelations = relations(materials, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [materials.workspaceId], references: [workspaces.id] }),
  embeddings: many(embeddings),
}));

export const mindmapNodeRelations = relations(mindmap_nodes, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [mindmap_nodes.workspaceId], references: [workspaces.id] }),
  parent: one(mindmap_nodes, {
    fields: [mindmap_nodes.parentId],
    references: [mindmap_nodes.id],
    relationName: "node_hierarchy",
  }),
  children: many(mindmap_nodes, { relationName: "node_hierarchy" }),
}));

// BetterAuth Tables (Session, Account, Verification)
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
