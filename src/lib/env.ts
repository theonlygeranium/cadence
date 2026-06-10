import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const localhostUrl = (value: string) => {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
};

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ENCRYPTION_KEY: z.string().min(32),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    PLAID_CLIENT_ID: z.string().min(1),
    PLAID_SECRET: z.string().min(1),
    PLAID_ENV: z.enum(["sandbox", "development", "production"]),
    OLLAMA_BASE_URL: z.string().url(),
    OLLAMA_MODEL: z.string().min(1),
    OLLAMA_ALLOW_REMOTE: z.enum(["true", "false"]).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.npm_lifecycle_event === "build" ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.npm_lifecycle_event === "typecheck",
  onValidationError: (issues) => {
    throw new Error(
      `Invalid environment variables: ${issues
        .map((issue) => issue.path?.join(".") || "environment")
        .join(", ")}`
    );
  },
});

if (env.OLLAMA_BASE_URL && !localhostUrl(env.OLLAMA_BASE_URL)) {
  if (env.OLLAMA_ALLOW_REMOTE !== "true") {
    throw new Error(
      "OLLAMA_BASE_URL must point to localhost unless OLLAMA_ALLOW_REMOTE=true is set."
    );
  }

  console.warn(
    "OLLAMA_BASE_URL is non-localhost; continuing because OLLAMA_ALLOW_REMOTE=true."
  );
}

export default env;
