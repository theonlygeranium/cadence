import { CountryCode, Products } from "plaid";

import { auth } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api/responses";
import { plaidClient } from "@/lib/plaid/client";

export async function POST(): Promise<Response> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorized();
  }

  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "Cadence",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: "en",
  });

  return ok({ link_token: response.data.link_token });
}
