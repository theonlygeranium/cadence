export type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
};

export type OllamaTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: JsonSchema;
  };
};

export const financialTools = [
  {
    type: "function",
    function: {
      name: "get_account_balances",
      description: "Returns all account balances for the authenticated user.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_recent_transactions",
      description: "Returns recent transactions with optional filters.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Maximum rows, default 50." },
          category: { type: "string" },
          startDate: { type: "string", description: "YYYY-MM-DD" },
          endDate: { type: "string", description: "YYYY-MM-DD" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_subscription_list",
      description: "Returns all detected active subscriptions.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cash_flow_forecast",
      description: "Returns projected cash flow around upcoming pay dates.",
      parameters: {
        type: "object",
        properties: {
          days: { type: "number", description: "Forecast horizon, default 30." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_spending_by_category",
      description: "Returns spending aggregated by category for a date range.",
      parameters: {
        type: "object",
        properties: {
          startDate: { type: "string", description: "YYYY-MM-DD" },
          endDate: { type: "string", description: "YYYY-MM-DD" },
        },
        required: ["startDate", "endDate"],
      },
    },
  },
] satisfies OllamaTool[];
