import { z } from "zod";

import {
  getAccountBalances,
  getCashFlowForecast,
  getRecentTransactions,
  getSpendingByCategory,
  getSubscriptionList,
} from "@/lib/ai/queries";

export class ToolExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolExecutionError";
  }
}

const recentTransactionsSchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const cashFlowSchema = z.object({
  days: z.number().int().min(1).max(180).optional(),
});

const spendingByCategorySchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  userId: string
): Promise<unknown> {
  switch (toolName) {
    case "get_account_balances":
      return getAccountBalances(userId);
    case "get_recent_transactions":
      return getRecentTransactions(userId, recentTransactionsSchema.parse(args));
    case "get_subscription_list":
      return getSubscriptionList(userId);
    case "get_cash_flow_forecast":
      return getCashFlowForecast(userId, cashFlowSchema.parse(args));
    case "get_spending_by_category":
      return getSpendingByCategory(userId, spendingByCategorySchema.parse(args));
    default:
      throw new ToolExecutionError(`Unknown tool: ${toolName}`);
  }
}
