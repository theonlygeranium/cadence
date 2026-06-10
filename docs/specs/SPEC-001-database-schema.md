# SPEC-001: Database Schema (Drizzle + PostgreSQL)

**Version:** 1.0  
**Status:** Ready for Implementation  
**Author:** WRITER Agent  
**Assignee:** Codex  
**Depends on:** SPEC-000 (environment setup must be complete)  
**Date:** 2026-06-09

---

## Objective

Define and implement the Cadence PostgreSQL database schema using Drizzle ORM. This schema supports all Phase 1 features: user accounts, Plaid linked items, accounts, transactions, and the subscription detection model.

---

## Pre-Build Checklist

- [ ] SPEC-000 is complete: `npm run build` exits 0
- [ ] `src/lib/db/client.ts` exports a working Drizzle client
- [ ] `DATABASE_URL` is set in `.env.local` and `src/lib/env.ts` validates it
- [ ] Run `npx drizzle-kit studio` and confirm connection to the local/Docker database

---

## Schema Definition

All tables go in `src/lib/db/schema.ts`. Use Drizzle's PostgreSQL dialect. Export each table as a named constant.

### users

```typescript
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
```

### accounts, sessions, verification_tokens

Standard NextAuth.js v5 tables required by the Drizzle adapter. Implement exactly per the `@auth/drizzle-adapter` documentation.

### plaid_items

```typescript
export const plaidItems = pgTable("plaid_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plaidItemId: text("plaid_item_id").notNull().unique(),
  accessToken: text("access_token").notNull(), // encrypted at rest
  institutionId: text("institution_id"),
  institutionName: text("institution_name"),
  status: text("status").notNull().default("active"), // active | error | login_required
  cursor: text("cursor"), // Plaid transaction sync cursor
  lastSyncedAt: timestamp("last_synced_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
```

### plaid_accounts

```typescript
export const plaidAccounts = pgTable("plaid_accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  plaidItemId: text("plaid_item_id").notNull().references(() => plaidItems.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plaidAccountId: text("plaid_account_id").notNull().unique(),
  name: text("name").notNull(),
  officialName: text("official_name"),
  type: text("type").notNull(), // depository | credit | loan | investment
  subtype: text("subtype"), // checking | savings | credit card | etc.
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }),
  availableBalance: numeric("available_balance", { precision: 12, scale: 2 }),
  isoCurrencyCode: text("iso_currency_code").default("USD"),
  mask: text("mask"), // last 4 digits
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
```

### transactions

```typescript
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  plaidAccountId: text("plaid_account_id").notNull().references(() => plaidAccounts.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plaidTransactionId: text("plaid_transaction_id").notNull().unique(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(), // positive = debit, negative = credit
  isoCurrencyCode: text("iso_currency_code").default("USD"),
  date: date("date").notNull(), // YYYY-MM-DD
  authorizedDate: date("authorized_date"),
  name: text("name").notNull(), // merchant name
  merchantName: text("merchant_name"),
  category: text("category").array(), // Plaid category hierarchy
  personalFinanceCategory: text("personal_finance_category"), // Plaid PFC primary
  pending: boolean("pending").notNull().default(false),
  paymentChannel: text("payment_channel"), // online | in store | other
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
```

### subscriptions

```typescript
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // detected merchant name
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  frequency: text("frequency").notNull(), // monthly | annual | weekly | semi-annual
  nextBillingDate: date("next_billing_date"),
  detectedAt: timestamp("detected_at", { mode: "date" }).notNull().defaultNow(),
  confirmedByUser: boolean("confirmed_by_user").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  plaidAccountId: text("plaid_account_id").references(() => plaidAccounts.id),
  logoUrl: text("logo_url"),
  category: text("category"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
```

### paycheck_profiles

```typescript
export const paycheckProfiles = pgTable("paycheck_profiles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  frequency: text("frequency").notNull().default("semi-monthly"), // semi-monthly | bi-weekly | monthly
  amount: numeric("amount", { precision: 12, scale: 2 }),
  nextPayDate: date("next_pay_date"),
  payDates: integer("pay_dates").array(), // [1, 15] for semi-monthly on 1st and 15th
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
```

---

## Indexes

Add the following indexes for query performance:

```typescript
export const transactionsUserDateIdx = index("transactions_user_date_idx")
  .on(transactions.userId, transactions.date);

export const transactionsPendingIdx = index("transactions_pending_idx")
  .on(transactions.userId, transactions.pending);

export const subscriptionsUserIdx = index("subscriptions_user_idx")
  .on(subscriptions.userId, subscriptions.isActive);
```

---

## Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npx drizzle-kit push` succeeds against the local PostgreSQL instance
- [ ] All 7 tables are present in the database (users, accounts, sessions, verification_tokens, plaid_items, plaid_accounts, transactions, subscriptions, paycheck_profiles)
- [ ] TypeScript types inferred from schema are used throughout — no manual type casting of database results
- [ ] `CHANGELOG.md` updated with Phase 1 database entry
- [ ] `docs/PROJECT_CONTINUITY.md` updated

---

## Security Notes

- `plaid_items.access_token` must be encrypted at rest. Implement AES-256-GCM encryption in `src/lib/db/crypto.ts` using `ENCRYPTION_KEY` from environment variables. Add `ENCRYPTION_KEY` to `.env.example`.
- Never log or return `access_token` from any API route.
- All database queries must be scoped to the authenticated `userId`. Never query across user boundaries.