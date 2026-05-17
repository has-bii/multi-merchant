import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./auth/routes.js";

type Env = {
  Bindings: {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  };
};

const app = new Hono<Env>();

// CORS — adjust origin for production
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Health check
app.get("/", (c) => c.json({ status: "ok" }));

// Auth routes — /api/auth/*
app.route("/api/auth", authRoutes);

export default app;
