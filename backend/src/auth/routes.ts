import { Hono } from "hono";
import { createAuth } from "../lib/auth.js";

type Env = {
  Bindings: {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  };
};

const authRoutes = new Hono<Env>();

authRoutes.on(["POST", "GET"], "/*", async (c) => {
  const auth = createAuth(
    c.env.DATABASE_URL,
    c.env.BETTER_AUTH_SECRET,
    c.env.BETTER_AUTH_URL,
  );
  return auth.handler(c.req.raw);
});

export default authRoutes;