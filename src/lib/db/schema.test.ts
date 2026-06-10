import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import {
  accounts,
  paycheckProfiles,
  plaidAccounts,
  plaidItems,
  sessions,
  subscriptions,
  transactions,
  users,
  verificationTokens,
} from "./schema";

describe("database schema", () => {
  it("uses the Cadence table names required by SPEC-001", () => {
    expect([
      getTableName(users),
      getTableName(accounts),
      getTableName(sessions),
      getTableName(verificationTokens),
      getTableName(plaidItems),
      getTableName(plaidAccounts),
      getTableName(transactions),
      getTableName(subscriptions),
      getTableName(paycheckProfiles),
    ]).toEqual([
      "users",
      "accounts",
      "sessions",
      "verification_tokens",
      "plaid_items",
      "plaid_accounts",
      "transactions",
      "subscriptions",
      "paycheck_profiles",
    ]);
  });
});
