import { randomUUID } from "node:crypto";

import type { AdapterAccountType } from "next-auth/adapters";
import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const id = () => randomUUID();

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(id),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

export const plaidItems = pgTable(
  "plaid_items",
  {
    id: text("id").primaryKey().$defaultFn(id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plaidItemId: text("plaid_item_id").notNull().unique(),
    accessToken: text("access_token").notNull(),
    institutionId: text("institution_id"),
    institutionName: text("institution_name"),
    status: text("status").notNull().default("active"),
    cursor: text("cursor"),
    lastSyncedAt: timestamp("last_synced_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (item) => [index("plaid_items_user_status_idx").on(item.userId, item.status)]
);

export const plaidAccounts = pgTable(
  "plaid_accounts",
  {
    id: text("id").primaryKey().$defaultFn(id),
    plaidItemId: text("plaid_item_id")
      .notNull()
      .references(() => plaidItems.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plaidAccountId: text("plaid_account_id").notNull().unique(),
    name: text("name").notNull(),
    officialName: text("official_name"),
    type: text("type").notNull(),
    subtype: text("subtype"),
    currentBalance: numeric("current_balance", { precision: 12, scale: 2 }),
    availableBalance: numeric("available_balance", { precision: 12, scale: 2 }),
    isoCurrencyCode: text("iso_currency_code").default("USD"),
    mask: text("mask"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (account) => [
    index("plaid_accounts_user_idx").on(account.userId),
    index("plaid_accounts_item_idx").on(account.plaidItemId),
  ]
);

export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey().$defaultFn(id),
    plaidAccountId: text("plaid_account_id")
      .notNull()
      .references(() => plaidAccounts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plaidTransactionId: text("plaid_transaction_id").notNull().unique(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    isoCurrencyCode: text("iso_currency_code").default("USD"),
    date: date("date").notNull(),
    authorizedDate: date("authorized_date"),
    name: text("name").notNull(),
    merchantName: text("merchant_name"),
    category: text("category").array(),
    personalFinanceCategory: text("personal_finance_category"),
    pending: boolean("pending").notNull().default(false),
    paymentChannel: text("payment_channel"),
    logoUrl: text("logo_url"),
    websiteUrl: text("website_url"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (transaction) => [
    index("transactions_user_date_idx").on(transaction.userId, transaction.date),
    index("transactions_pending_idx").on(transaction.userId, transaction.pending),
    index("transactions_account_idx").on(transaction.plaidAccountId),
  ]
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey().$defaultFn(id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    frequency: text("frequency").notNull(),
    nextBillingDate: date("next_billing_date"),
    detectedAt: timestamp("detected_at", { mode: "date" }).notNull().defaultNow(),
    confirmedByUser: boolean("confirmed_by_user").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    plaidAccountId: text("plaid_account_id").references(() => plaidAccounts.id),
    logoUrl: text("logo_url"),
    category: text("category"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (subscription) => [
    index("subscriptions_user_idx").on(subscription.userId, subscription.isActive),
  ]
);

export const paycheckProfiles = pgTable("paycheck_profiles", {
  id: text("id").primaryKey().$defaultFn(id),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  frequency: text("frequency").notNull().default("semi-monthly"),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  nextPayDate: date("next_pay_date"),
  payDates: integer("pay_dates").array(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  authAccounts: many(accounts),
  sessions: many(sessions),
  plaidItems: many(plaidItems),
  plaidAccounts: many(plaidAccounts),
  transactions: many(transactions),
  subscriptions: many(subscriptions),
  paycheckProfile: one(paycheckProfiles),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const plaidItemsRelations = relations(plaidItems, ({ many, one }) => ({
  user: one(users, {
    fields: [plaidItems.userId],
    references: [users.id],
  }),
  accounts: many(plaidAccounts),
}));

export const plaidAccountsRelations = relations(plaidAccounts, ({ many, one }) => ({
  user: one(users, {
    fields: [plaidAccounts.userId],
    references: [users.id],
  }),
  item: one(plaidItems, {
    fields: [plaidAccounts.plaidItemId],
    references: [plaidItems.id],
  }),
  transactions: many(transactions),
  subscriptions: many(subscriptions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  plaidAccount: one(plaidAccounts, {
    fields: [transactions.plaidAccountId],
    references: [plaidAccounts.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plaidAccount: one(plaidAccounts, {
    fields: [subscriptions.plaidAccountId],
    references: [plaidAccounts.id],
  }),
}));

export const paycheckProfilesRelations = relations(paycheckProfiles, ({ one }) => ({
  user: one(users, {
    fields: [paycheckProfiles.userId],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type PlaidItem = InferSelectModel<typeof plaidItems>;
export type NewPlaidItem = InferInsertModel<typeof plaidItems>;
export type PlaidAccount = InferSelectModel<typeof plaidAccounts>;
export type NewPlaidAccount = InferInsertModel<typeof plaidAccounts>;
export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;
export type PaycheckProfile = InferSelectModel<typeof paycheckProfiles>;
export type NewPaycheckProfile = InferInsertModel<typeof paycheckProfiles>;
