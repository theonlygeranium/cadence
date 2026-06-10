import { and, desc, eq, gte, ilike, lte } from "drizzle-orm";

import { db } from "@/lib/db/client";
import {
  paycheckProfiles,
  plaidAccounts,
  subscriptions,
  transactions,
} from "@/lib/db/schema";

function toNumber(value: string | null): number {
  return value == null ? 0 : Number(value);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export async function getAccountBalances(userId: string) {
  const accounts = await db
    .select({
      name: plaidAccounts.name,
      type: plaidAccounts.type,
      currentBalance: plaidAccounts.currentBalance,
      availableBalance: plaidAccounts.availableBalance,
    })
    .from(plaidAccounts)
    .where(eq(plaidAccounts.userId, userId));

  return {
    accounts: accounts.map((account) => ({
      ...account,
      currentBalance: toNumber(account.currentBalance),
      availableBalance: toNumber(account.availableBalance),
    })),
  };
}

export async function getRecentTransactions(
  userId: string,
  args: {
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  const filters = [eq(transactions.userId, userId)];

  if (args.category) {
    filters.push(ilike(transactions.personalFinanceCategory, args.category));
  }

  if (args.startDate) {
    filters.push(gte(transactions.date, args.startDate));
  }

  if (args.endDate) {
    filters.push(lte(transactions.date, args.endDate));
  }

  const rows = await db
    .select({
      date: transactions.date,
      name: transactions.name,
      amount: transactions.amount,
      category: transactions.personalFinanceCategory,
      accountName: plaidAccounts.name,
    })
    .from(transactions)
    .innerJoin(plaidAccounts, eq(transactions.plaidAccountId, plaidAccounts.id))
    .where(and(...filters))
    .orderBy(desc(transactions.date))
    .limit(args.limit ?? 50);

  return {
    transactions: rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    })),
  };
}

export async function getSubscriptionList(userId: string) {
  const rows = await db
    .select({
      name: subscriptions.name,
      amount: subscriptions.amount,
      frequency: subscriptions.frequency,
      nextBillingDate: subscriptions.nextBillingDate,
    })
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)));

  const subscriptionsList = rows.map((row) => ({
    ...row,
    amount: Number(row.amount),
  }));

  return {
    subscriptions: subscriptionsList,
    totalMonthly: subscriptionsList.reduce((total, subscription) => {
      if (subscription.frequency === "annual") {
        return total + subscription.amount / 12;
      }
      if (subscription.frequency === "weekly") {
        return total + subscription.amount * 4.33;
      }
      if (subscription.frequency === "semi-annual") {
        return total + subscription.amount / 6;
      }
      return total + subscription.amount;
    }, 0),
  };
}

export async function getCashFlowForecast(
  userId: string,
  args: { days?: number }
) {
  const horizon = Math.min(Math.max(args.days ?? 30, 1), 180);
  const endDate = addDays(horizon);
  const [profile] = await db
    .select()
    .from(paycheckProfiles)
    .where(eq(paycheckProfiles.userId, userId))
    .limit(1);
  const bills = await db
    .select({
      name: subscriptions.name,
      amount: subscriptions.amount,
      dueDate: subscriptions.nextBillingDate,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.isActive, true),
        gte(subscriptions.nextBillingDate, today()),
        lte(subscriptions.nextBillingDate, endDate)
      )
    );
  const accountRows = await db
    .select({ currentBalance: plaidAccounts.currentBalance })
    .from(plaidAccounts)
    .where(eq(plaidAccounts.userId, userId));
  const projectedBalance =
    accountRows.reduce((total, account) => total + toNumber(account.currentBalance), 0) -
    bills.reduce((total, bill) => total + Number(bill.amount), 0);

  return {
    payDates: profile?.nextPayDate ? [profile.nextPayDate] : [],
    upcomingBills: bills.map((bill) => ({
      name: bill.name,
      amount: Number(bill.amount),
      dueDate: bill.dueDate,
    })),
    projectedBalance,
  };
}

export async function getSpendingByCategory(
  userId: string,
  args: { startDate: string; endDate: string }
) {
  const rows = await db
    .select({
      category: transactions.personalFinanceCategory,
      amount: transactions.amount,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, args.startDate),
        lte(transactions.date, args.endDate)
      )
    );
  const totals = new Map<string, number>();

  for (const row of rows) {
    const category = row.category ?? "Uncategorized";
    const value = Number(row.amount);
    if (value > 0) {
      totals.set(category, (totals.get(category) ?? 0) + value);
    }
  }

  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);

  return {
    categories: [...totals.entries()].map(([name, total]) => ({
      name,
      total,
      percentage: grandTotal === 0 ? 0 : total / grandTotal,
    })),
  };
}

export async function getMinimalUserContext(userId: string) {
  const accounts = await db
    .select({ id: plaidAccounts.id })
    .from(plaidAccounts)
    .where(eq(plaidAccounts.userId, userId));
  const [lastTransaction] = await db
    .select({ date: transactions.date })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(1);
  const [profile] = await db
    .select({
      frequency: paycheckProfiles.frequency,
      nextPayDate: paycheckProfiles.nextPayDate,
    })
    .from(paycheckProfiles)
    .where(eq(paycheckProfiles.userId, userId))
    .limit(1);

  return {
    accountCount: accounts.length,
    lastTransactionDate: lastTransaction?.date ?? null,
    paycheckProfile: profile ?? null,
  };
}
