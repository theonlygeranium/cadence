import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { plaidAccounts, type PlaidAccount } from "@/lib/db/schema";

export type AccountSummary = {
  totalBalance: number;
  creditCardBalance: number;
  checkingBalance: number;
  savingsBalance: number;
  accounts: PlaidAccount[];
};

function amount(value: string | null): number {
  return value == null ? 0 : Number(value);
}

export async function getAccountSummary(userId: string): Promise<AccountSummary> {
  const accounts = await db
    .select()
    .from(plaidAccounts)
    .where(eq(plaidAccounts.userId, userId));

  return accounts.reduce<AccountSummary>(
    (summary, account) => {
      const balance = amount(account.currentBalance);
      summary.totalBalance += balance;

      if (account.type === "credit") {
        summary.creditCardBalance += balance;
      }

      if (account.subtype === "checking") {
        summary.checkingBalance += balance;
      }

      if (account.subtype === "savings") {
        summary.savingsBalance += balance;
      }

      summary.accounts.push(account);
      return summary;
    },
    {
      totalBalance: 0,
      creditCardBalance: 0,
      checkingBalance: 0,
      savingsBalance: 0,
      accounts: [],
    }
  );
}
