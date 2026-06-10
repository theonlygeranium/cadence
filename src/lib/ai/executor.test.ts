import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { financialTools } from "./tools";

function stubRequiredEnv() {
  vi.stubEnv("DATABASE_URL", "postgresql://cadence:test@localhost:5432/cadence");
  vi.stubEnv("ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef");
  vi.stubEnv("NEXTAUTH_SECRET", "ci_placeholder_secret_min_32_chars_xx");
  vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000");
  vi.stubEnv("PLAID_CLIENT_ID", "placeholder_client");
  vi.stubEnv("PLAID_SECRET", "placeholder_secret");
  vi.stubEnv("PLAID_ENV", "sandbox");
  vi.stubEnv("OLLAMA_BASE_URL", "http://127.0.0.1:11434");
  vi.stubEnv("OLLAMA_MODEL", "qwen3.6:latest");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
}

describe("AI tool executor", () => {
  beforeEach(() => {
    vi.resetModules();
    stubRequiredEnv();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("exposes the required financial tool names", () => {
    expect(financialTools.map((tool) => tool.function.name)).toEqual([
      "get_account_balances",
      "get_recent_transactions",
      "get_subscription_list",
      "get_cash_flow_forecast",
      "get_spending_by_category",
    ]);
  });

  it("throws a typed error for unknown tools", async () => {
    const { executeTool, ToolExecutionError } = await import("./executor");

    await expect(executeTool("unknown_tool", {}, "user_1")).rejects.toBeInstanceOf(
      ToolExecutionError
    );
  });
});
