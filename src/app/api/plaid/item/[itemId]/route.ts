import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { ok, fail, unauthorized } from "@/lib/api/responses";
import { decryptSecret } from "@/lib/db/crypto";
import { db } from "@/lib/db/client";
import { plaidItems } from "@/lib/db/schema";
import { plaidClient } from "@/lib/plaid/client";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ itemId: string }> }
): Promise<Response> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorized();
  }

  const { itemId } = await context.params;
  const [item] = await db
    .select()
    .from(plaidItems)
    .where(and(eq(plaidItems.id, itemId), eq(plaidItems.userId, userId)))
    .limit(1);

  if (!item) {
    return fail("Plaid item not found.", 404, "NOT_FOUND");
  }

  await plaidClient.itemRemove({ access_token: decryptSecret(item.accessToken) });
  await db
    .delete(plaidItems)
    .where(and(eq(plaidItems.id, item.id), eq(plaidItems.userId, userId)));

  return ok({ success: true });
}
