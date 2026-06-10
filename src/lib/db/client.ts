import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

const globalForPostgres = globalThis as unknown as {
  cadencePostgres?: ReturnType<typeof postgres>;
};

const queryClient =
  globalForPostgres.cadencePostgres ??
  postgres(env.DATABASE_URL, {
    max: 1,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.cadencePostgres = queryClient;
}

export const db = drizzle(queryClient, { schema });
