import { relations, sql } from "drizzle-orm"
import { boolean, index, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
})

export const session = pgTable(
  "session",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonatedBy"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

export const account = pgTable(
  "account",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const verification = pgTable(
  "verification",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  merchants: many(merchant),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const productHets = pgTable("productHets", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: text("name").notNull().unique(),
  price: numeric("price").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const merchant = pgTable(
  "merchant",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    name: text("name").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("merchant_userId_idx").on(table.userId),
    index("merchant_name_idx").on(table.name),
  ],
)

export const merchantRelations = relations(merchant, ({ one }) => ({
  user: one(user, {
    fields: [merchant.userId],
    references: [user.id],
  }),
}))
