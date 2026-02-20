import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import materialRoutes from "./routes/material.routes";
import aiRoutes from "./routes/ai.routes";

config({ path: ".env" });

const app = new Hono();
const port = Number(process.env.PORT) || 3001;

// Define allowed origins for CORS
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ["http://localhost:3000"];

// 1. Security Headers Middleware
app.use("*", secureHeaders());

// 2. CORS Middleware
app.use(
  "/*",
  cors({
    origin: allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// 3. Compression Middleware
app.use("*", compress());


app.get("/", (c) => {
  return c.text("Luminar AI Backend is Running");
});

app.route("/api/auth", authRoutes);
app.route("/api/workspaces", workspaceRoutes);
app.route("/api/materials", materialRoutes);
app.route("/api/ai", aiRoutes);

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
