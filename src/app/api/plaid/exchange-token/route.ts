import { z } from "zod";

import { auth } from "@/lib/auth";
import { ok, fail, unauthorized } from "@/lib/api/responses";
import { encryptSecret } from "@/lib/db/crypto";
import { db } from "@/lib/db/client";
import { plaidItems } from "@/lib/db/schema";
import { plaidClient } from "@/lib/plaid/client";
import { syncAccountsForItem, syncTransactions } from "@/lib/plaid/sync";

const exchangeTokenSchema = z.object({
  public_token: z.string().min(1),
  institution: z
    .object({
      institution_id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorized();
  }

  const body = exchangeTokenSchema.safeParse(await req.json());
  if (!body.success) {
    return fail("Invalid Plaid token exchange payload.", 400, "INVALID_PAYLOAD");
  }

  const exchange = await plaidClient.itemPublicTokenExchange({
    public_token: body.data.public_token,
  });
  const [item] = await db
    .insert(plaidItems)
    .values({
      userId,
      plaidItemId: exchange.data.item_id,
      accessToken: encryptSecret(exchange.data.access_token),
      institutionId: body.data.institution?.institution_id,
      institutionName: body.data.institution?.name,
      status: "active",
    })
    .onConflictDoUpdate({
      target: plaidItems.plaidItemId,
      set: {
        accessToken: encryptSecret(exchange.data.access_token),
        institutionId: body.data.institution?.institution_id,
        institutionName: body.data.institution?.name,
        status: "active",
        updatedAt: new Date(),
      },
    })
    .returning();

  await syncAccountsForItem(userId, item.id);
  const sync = await syncTransactions(userId, item.id);

  return ok({ itemId: item.id, sync });
}
