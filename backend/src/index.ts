import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import materialRoutes from "./routes/material.routes";

config({ path: ".env" });

const app = new Hono();
const port = Number(process.env.PORT) || 3001;

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Luminar AI Backend is Running");
});

app.route("/api/auth", authRoutes);
app.route("/api/workspaces", workspaceRoutes);
app.route("/api/materials", materialRoutes);

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
