import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { createDb } from "../db/index.js";
import * as schema from "../db/schema.js";

export function createAuth(databaseUrl: string, secret: string, baseURL?: string) {
  const db = createDb(databaseUrl);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),
    secret,
    ...(baseURL ? { baseURL } : {}),
  });
}

export type Auth = ReturnType<typeof createAuth>;