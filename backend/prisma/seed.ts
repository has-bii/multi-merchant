import { PrismaNeon } from "@prisma/adapter-neon"
import { hashPassword } from "better-auth/crypto"
import "dotenv/config"

import { PrismaClient } from "../src/generated/prisma/client.js"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

const USERS = [
  {
    email: "user@example.com",
    name: "User One",
    phone: "081234567891",
    address: "123 Main St",
    description: "First merchant",
  },
  {
    email: "user2@example.com",
    name: "User Two",
    phone: "081234567892",
    address: "456 Oak Ave",
    description: "Second merchant",
  },
  {
    email: "user3@example.com",
    name: "User Three",
    phone: "081234567893",
    address: "789 Pine Rd",
    description: "Third merchant",
  },
  {
    email: "user4@example.com",
    name: "User Four",
    phone: "081234567894",
    address: "321 Elm St",
    description: "Fourth merchant",
  },
  {
    email: "user5@example.com",
    name: "User Five",
    phone: "081234567895",
    address: "654 Cedar Ln",
    description: "Fifth merchant",
  },
]

const DEFAULT_PASSWORD = "password123"

async function seedAdmin() {
  const EMAIL = process.env.ADMIN_EMAIL!
  const PASSWORD = process.env.ADMIN_PASSWORD!

  const existing = await db.user.findUnique({ where: { email: EMAIL } })

  if (existing) {
    console.log(`Admin "${EMAIL}" exists — skip.`)
    return
  }

  const hashedPassword = await hashPassword(PASSWORD)

  const adminUser = await db.user.create({
    data: {
      name: "Admin",
      email: EMAIL,
      emailVerified: true,
      role: "admin",
    },
  })

  await db.account.create({
    data: {
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: "credential",
      password: hashedPassword,
    },
  })

  console.log(`✓ Admin "${EMAIL}" created.`)
}

async function seedUsersAndMerchants() {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD)

  for (const u of USERS) {
    const existing = await db.user.findUnique({ where: { email: u.email } })

    if (existing) {
      console.log(`User "${u.email}" exists — skip.`)
      continue
    }

    const insertedUser = await db.user.create({
      data: {
        name: u.name,
        email: u.email,
        emailVerified: true,
        role: "user",
      },
    })

    await db.account.create({
      data: {
        userId: insertedUser.id,
        accountId: insertedUser.id,
        providerId: "credential",
        password: hashedPassword,
      },
    })

    const merchantName = u.name.toLowerCase().replace(/\s+/g, "-")

    const existingMerchant = await db.merchant.findUnique({
      where: { userId: insertedUser.id },
    })

    if (existingMerchant) {
      console.log(`Merchant for "${u.email}" exists — skip.`)
    } else {
      await db.merchant.create({
        data: {
          name: merchantName,
          userId: insertedUser.id,
          phone: u.phone,
          address: u.address,
          description: u.description,
        },
      })
      console.log(`✓ User "${u.email}" + merchant "${merchantName}" created.`)
    }
  }
}

async function seed() {
  await seedAdmin()
  await seedUsersAndMerchants()
  console.log("Seed complete.")
  await db.$disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
