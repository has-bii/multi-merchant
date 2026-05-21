import "dotenv/config";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import { env } from "../config/env.js";
import { db } from "../lib/db.js";
import { account, user, merchant } from "./schema.js";

const USERS = [
  { email: "user@example.com", name: "User One", phone: "+1000000001", address: "123 Main St", description: "First merchant" },
  { email: "user2@example.com", name: "User Two", phone: "+1000000002", address: "456 Oak Ave", description: "Second merchant" },
  { email: "user3@example.com", name: "User Three", phone: "+1000000003", address: "789 Pine Rd", description: "Third merchant" },
  { email: "user4@example.com", name: "User Four", phone: "+1000000004", address: "321 Elm Blvd", description: "Fourth merchant" },
  { email: "user5@example.com", name: "User Five", phone: "+1000000005", address: "654 Cedar Ln", description: "Fifth merchant" },
];

const DEFAULT_PASSWORD = "password123";

async function seedAdmin() {
  const { EMAIL, PASSWORD } = env.ADMIN;

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, EMAIL))
    .limit(1);

  if (existing) {
    console.log(`Admin "${EMAIL}" exists — skip.`);
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

  console.log(`✓ Admin "${EMAIL}" created.`);
}

async function seedUsersAndMerchants() {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  for (const u of USERS) {
    const [existing] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, u.email))
      .limit(1);

    if (existing) {
      console.log(`User "${u.email}" exists — skip.`);
      continue;
    }

    await db.insert(user).values({
      name: u.name,
      email: u.email,
      emailVerified: true,
      role: "user",
    });

    const [insertedUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, u.email))
      .limit(1);

    await db.insert(account).values({
      userId: insertedUser!.id,
      accountId: insertedUser!.id,
      providerId: "credential",
      password: hashedPassword,
    });

    // Merchant name = lowercase hyphenated from user name
    const merchantName = u.name.toLowerCase().replace(/\s+/g, "-");

    const [existingMerchant] = await db
      .select({ id: merchant.id })
      .from(merchant)
      .where(eq(merchant.userId, insertedUser!.id))
      .limit(1);

    if (existingMerchant) {
      console.log(`Merchant for "${u.email}" exists — skip.`);
    } else {
      await db.insert(merchant).values({
        name: merchantName,
        userId: insertedUser!.id,
        phone: u.phone,
        address: u.address,
        description: u.description,
      });
      console.log(`✓ User "${u.email}" + merchant "${merchantName}" created.`);
    }
  }
}

async function seed() {
  await seedAdmin();
  await seedUsersAndMerchants();
  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});