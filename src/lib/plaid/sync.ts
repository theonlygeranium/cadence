import { and, eq, inArray } from "drizzle-orm";
import type { AccountBase, Transaction } from "plaid";

import { decryptSecret } from "@/lib/db/crypto";
import { db } from "@/lib/db/client";
import { plaidAccounts, plaidItems, transactions } from "@/lib/db/schema";
import { getPlaidErrorCode, getPlaidHttpStatus, sanitizePlaidError } from "@/lib/plaid/errors";
import { plaidClient } from "@/lib/plaid/client";

export type SyncResult = {
  added: number;
  modified: number;
  removed: number;
};

const RATE_LIMIT_RETRIES = 3;

function toMoney(value: number | null | undefined): string | null {
  return value == null ? null : value.toFixed(2);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withPlaidRetry<T>(operation: () => Promise<T>): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (getPlaidHttpStatus(error) !== 429 || attempt >= RATE_LIMIT_RETRIES) {
        throw error;
      }

      await wait(2 ** attempt * 250);
      attempt += 1;
    }
  }
}

async function findOwnedPlaidItem(userId: string, plaidItemId: string) {
  const [item] = await db
    .select()
    .from(plaidItems)
    .where(and(eq(plaidItems.id, plaidItemId), eq(plaidItems.userId, userId)))
    .limit(1);

  return item;
}

async function upsertPlaidAccounts(
  userId: string,
  cadencePlaidItemId: string,
  accounts: AccountBase[]
): Promise<Map<string, string>> {
  for (const account of accounts) {
    await db
      .insert(plaidAccounts)
      .values({
        plaidItemId: cadencePlaidItemId,
        userId,
        plaidAccountId: account.account_id,
        name: account.name,
        officialName: account.official_name,
        type: account.type,
        subtype: account.subtype,
        currentBalance: toMoney(account.balances.current),
        availableBalance: toMoney(account.balances.available),
        isoCurrencyCode: account.balances.iso_currency_code ?? "USD",
        mask: account.mask,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: plaidAccounts.plaidAccountId,
        set: {
          name: account.name,
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype,
          currentBalance: toMoney(account.balances.current),
          availableBalance: toMoney(account.balances.available),
          isoCurrencyCode: account.balances.iso_currency_code ?? "USD",
          mask: account.mask,
          updatedAt: new Date(),
        },
      });
  }

  const rows = await db
    .select({
      id: plaidAccounts.id,
      plaidAccountId: plaidAccounts.plaidAccountId,
    })
    .from(plaidAccounts)
    .where(
      and(
        eq(plaidAccounts.userId, userId),
        eq(plaidAccounts.plaidItemId, cadencePlaidItemId)
      )
    );

  return new Map(rows.map((row) => [row.plaidAccountId, row.id]));
}

async function upsertTransaction(
  userId: string,
  accountIdByPlaidId: Map<string, string>,
  transaction: Transaction
): Promise<void> {
  const cadenceAccountId = accountIdByPlaidId.get(transaction.account_id);

  if (!cadenceAccountId) {
    throw new Error("Transaction references an unknown Plaid account.");
  }

  await db
    .insert(transactions)
    .values({
      plaidAccountId: cadenceAccountId,
      userId,
      plaidTransactionId: transaction.transaction_id,
      amount: toMoney(transaction.amount) ?? "0.00",
      isoCurrencyCode: transaction.iso_currency_code ?? "USD",
      date: transaction.date,
      authorizedDate: transaction.authorized_date,
      name: transaction.name,
      merchantName: transaction.merchant_name,
      category: transaction.category ?? null,
      personalFinanceCategory: transaction.personal_finance_category?.primary,
      pending: transaction.pending,
      paymentChannel: transaction.payment_channel,
      logoUrl: transaction.logo_url,
      websiteUrl: transaction.website,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: transactions.plaidTransactionId,
      set: {
        plaidAccountId: cadenceAccountId,
        amount: toMoney(transaction.amount) ?? "0.00",
        isoCurrencyCode: transaction.iso_currency_code ?? "USD",
        date: transaction.date,
        authorizedDate: transaction.authorized_date,
        name: transaction.name,
        merchantName: transaction.merchant_name,
        category: transaction.category ?? null,
        personalFinanceCategory: transaction.personal_finance_category?.primary,
        pending: transaction.pending,
        paymentChannel: transaction.payment_channel,
        logoUrl: transaction.logo_url,
        websiteUrl: transaction.website,
        updatedAt: new Date(),
      },
    });
}

export async function syncAccountsForItem(
  userId: string,
  plaidItemId: string
): Promise<number> {
  const item = await findOwnedPlaidItem(userId, plaidItemId);

  if (!item) {
    throw new Error("Plaid item not found.");
  }

  const accessToken = decryptSecret(item.accessToken);
  const response = await withPlaidRetry(() =>
    plaidClient.accountsGet({ access_token: accessToken })
  );

  await upsertPlaidAccounts(userId, item.id, response.data.accounts);

  return response.data.accounts.length;
}

export async function syncTransactions(
  userId: string,
  plaidItemId: string
): Promise<SyncResult> {
  const item = await findOwnedPlaidItem(userId, plaidItemId);

  if (!item) {
    throw new Error("Plaid item not found.");
  }

  const accessToken = decryptSecret(item.accessToken);
  let cursor = item.cursor ?? undefined;
  let hasMore = true;
  let latestCursor = cursor;
  const result: SyncResult = { added: 0, modified: 0, removed: 0 };

  try {
    while (hasMore) {
      const response = await withPlaidRetry(() =>
        plaidClient.transactionsSync({
          access_token: accessToken,
          cursor,
          count: 500,
        })
      );
      const data = response.data;
      const accountIdByPlaidId = await upsertPlaidAccounts(
        userId,
        item.id,
        data.accounts
      );

      for (const transaction of data.added) {
        await upsertTransaction(userId, accountIdByPlaidId, transaction);
      }

      for (const transaction of data.modified) {
        await upsertTransaction(userId, accountIdByPlaidId, transaction);
      }

      if (data.removed.length > 0) {
        await db
          .delete(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              inArray(
                transactions.plaidTransactionId,
                data.removed.map((transaction) => transaction.transaction_id)
              )
            )
          );
      }

      result.added += data.added.length;
      result.modified += data.modified.length;
      result.removed += data.removed.length;
      latestCursor = data.next_cursor;
      cursor = data.next_cursor;
      hasMore = data.has_more;
    }

    await db
      .update(plaidItems)
      .set({
        cursor: latestCursor,
        status: "active",
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(plaidItems.id, item.id), eq(plaidItems.userId, userId)));

    return result;
  } catch (error) {
    if (getPlaidErrorCode(error) === "ITEM_LOGIN_REQUIRED") {
      await db
        .update(plaidItems)
        .set({ status: "login_required", updatedAt: new Date() })
        .where(and(eq(plaidItems.id, item.id), eq(plaidItems.userId, userId)));
      return result;
    }

    const sanitized = sanitizePlaidError(error);
    console.error("Plaid transaction sync failed", sanitized);
    throw error;
  }
}
