import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api/responses";
import { db } from "@/lib/db/client";
import { plaidItems } from "@/lib/db/schema";
import { syncTransactions, type SyncResult } from "@/lib/plaid/sync";

export async function POST(): Promise<Response> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorized();
  }

  const items = await db
    .select({ id: plaidItems.id })
    .from(plaidItems)
    .where(and(eq(plaidItems.userId, userId), eq(plaidItems.status, "active")));

  const aggregate: SyncResult = { added: 0, modified: 0, removed: 0 };

  for (const item of items) {
    const result = await syncTransactions(userId, item.id);
    aggregate.added += result.added;
    aggregate.modified += result.modified;
    aggregate.removed += result.removed;
  }

  return ok({ items: items.length, sync: aggregate });
}
