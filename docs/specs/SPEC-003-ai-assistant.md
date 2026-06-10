# SPEC-003: AI Assistant Architecture (Ollama Tool-Calling)

**Version:** 1.0  
**Status:** Ready for Implementation  
**Author:** WRITER Agent  
**Assignee:** Codex  
**Depends on:** SPEC-001 (database schema), SPEC-002 (Plaid sync — transactions must exist)  
**Date:** 2026-06-09

---

## Objective

Implement the Cadence AI assistant as a tool-calling agent backed by Ollama (`qwen3.6:latest`). The assistant must ground all financial responses in real database query results. It must never generate financial figures, balances, dates, or transaction amounts from model weights alone.

---

## Pre-Build Checklist

- [ ] SPEC-001 and SPEC-002 are complete
- [ ] Ollama is accessible at `OLLAMA_BASE_URL` (default: `http://127.0.0.1:11434`)
- [ ] `qwen3.6:latest` model is available: `curl http://127.0.0.1:11434/api/tags`
- [ ] At least one Plaid item is synced with representative transaction data

---

## Architecture

The AI assistant uses an **agentic tool-calling loop**:

```
User message
     ↓
System prompt (user financial context header)
     ↓
Ollama /api/chat (with tools defined)
     ↓
Model emits tool_call
     ↓
Tool executor runs DB query
     ↓
Tool result injected as message
     ↓
Model generates grounded response
     ↓
Response streamed to client
```

This loop continues until the model emits a final text response without a tool call (or a configurable max-iteration limit of 6 is reached).

---

## Implementation

### 1. Ollama Client — `src/lib/ai/client.ts`

```typescript
import { env } from "@/lib/env";

export type OllamaChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: OllamaToolCall[];
  tool_call_id?: string;
};

export type OllamaToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: Record<string, unknown> };
};

export async function* streamOllamaChat(
  messages: OllamaChatMessage[],
  tools: OllamaTool[],
): AsyncGenerator<string>
```

Implement `streamOllamaChat` as an async generator that:
1. POSTs to `${env.OLLAMA_BASE_URL}/api/chat` with `{ model: env.OLLAMA_MODEL, messages, tools, stream: true }`
2. Reads the NDJSON stream
3. Yields text delta chunks
4. Yields structured tool call objects as JSON-serialized events prefixed with `__tool_call:`

### 2. Tool Definitions — `src/lib/ai/tools.ts`

Define the following tools as Ollama tool schemas:

#### `get_account_balances`
Returns all account balances for the authenticated user.
- Parameters: none
- Returns: `{ accounts: Array<{ name, type, currentBalance, availableBalance }> }`

#### `get_recent_transactions`
Returns recent transactions with optional filtering.
- Parameters: `{ limit?: number (default 50), category?: string, startDate?: string, endDate?: string }`
- Returns: `{ transactions: Array<{ date, name, amount, category, accountName }> }`

#### `get_subscription_list`
Returns all detected subscriptions.
- Parameters: none
- Returns: `{ subscriptions: Array<{ name, amount, frequency, nextBillingDate }>, totalMonthly: number }`

#### `get_cash_flow_forecast`
Returns projected cash flow around the next pay dates.
- Parameters: `{ days?: number (default 30) }`
- Returns: `{ payDates: string[], upcomingBills: Array<{ name, amount, dueDate }>, projectedBalance: number }`

#### `get_spending_by_category`
Returns spending aggregated by category for a date range.
- Parameters: `{ startDate: string, endDate: string }`
- Returns: `{ categories: Array<{ name, total, percentage }> }`

### 3. Tool Executor — `src/lib/ai/executor.ts`

```typescript
export async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  userId: string,
): Promise<unknown>
```

This function:
- Routes tool calls to the corresponding database query functions in `src/lib/ai/queries.ts`
- All queries must include `userId` in their WHERE clause
- Returns the query result as a plain JavaScript object
- Throws a typed `ToolExecutionError` if the tool name is unknown or args are invalid

### 4. Database Queries — `src/lib/ai/queries.ts`

Implement one query function per tool. All functions accept `userId: string` as a required parameter. All use the Drizzle client. None of these functions call Ollama — they are pure database reads.

### 5. Chat API Route — POST `/api/chat`

```typescript
// src/app/api/chat/route.ts
export async function POST(req: Request): Promise<Response>
```

This route:
1. Authenticates the user via `auth()`; returns 401 if no session
2. Parses `{ messages: OllamaChatMessage[] }` from request body
3. Prepends a system message containing a minimal user context header (account count, last sync date, paycheck profile — no raw balances in system prompt)
4. Runs the tool-calling loop (max 6 iterations)
5. Streams the final response using the Web Streams API (`ReadableStream`)
6. Returns a `text/event-stream` response

Rate limiting: implement a per-user in-memory rate limit of 20 requests/minute using a sliding window.

### 6. Chat UI — `src/app/(dashboard)/chat/page.tsx`

Implement a minimal chat interface using shadcn/ui components:
- Message list with user and assistant bubbles
- Streaming text rendering (update bubble as tokens arrive)
- Input field with send button
- Loading state while waiting for first token
- Error state with retry affordance

---

## Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] A chat message asking "What are my account balances?" triggers a `get_account_balances` tool call and returns a grounded response
- [ ] The assistant response for balance questions contains figures that match the `plaid_accounts` table exactly
- [ ] A question with no financial data needed (e.g. "What is a credit score?") responds without any tool calls
- [ ] The streaming response appears incrementally in the UI (not all at once)
- [ ] The route returns 401 when called without an authenticated session
- [ ] `CHANGELOG.md` updated
- [ ] `docs/PROJECT_CONTINUITY.md` updated

---

## Security Notes

- Never include raw Plaid access tokens in LLM context.
- Never include other users' data in any tool query.
- The system prompt must not include PII beyond what is necessary for the immediate query.
- Log tool call names and execution times; never log tool call arguments containing financial data.
- If `OLLAMA_BASE_URL` is not `localhost` or `127.0.0.1`, require an explicit `OLLAMA_ALLOW_REMOTE=true` environment variable and log a warning at startup.