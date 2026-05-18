import "dotenv/config";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { env } from "../config/env.js";
import { db } from "../lib/db.js";
import { account, user } from "./schema.js";

async function seed() {
  const { EMAIL, PASSWORD } = env.ADMIN;

  // Check if admin already exists
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, EMAIL))
    .limit(1);

  if (existing) {
    console.log(`Admin user "${EMAIL}" already exists — skipping.`);
    return;
  }

  const hashedPassword = await hashPassword(PASSWORD);

  await db.insert(user).values({
    name: "Admin",
    email: EMAIL,
    emailVerified: true,
    role: "admin",
  });

  const [adminUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, EMAIL))
    .limit(1);

  await db.insert(account).values({
    userId: adminUser!.id,
    accountId: adminUser!.id,
    providerId: "credential",
    password: hashedPassword,
  });

  console.log(`✓ Admin user "${EMAIL}" created.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});