import { auth } from "@/lib/auth";
import {
  streamOllamaChat,
  type OllamaChatMessage,
  type OllamaToolCall,
} from "@/lib/ai/client";
import { executeTool } from "@/lib/ai/executor";
import { getMinimalUserContext } from "@/lib/ai/queries";
import { financialTools } from "@/lib/ai/tools";
import { fail, unauthorized } from "@/lib/api/responses";
import { z } from "zod";

const MAX_TOOL_ITERATIONS = 6;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitWindows = new Map<string, number[]>();
const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4_000),
      })
    )
    .min(1)
    .max(30),
});

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitWindows.get(userId) ?? []).filter(
    (timestamp) => timestamp > windowStart
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitWindows.set(userId, timestamps);
    return true;
  }

  timestamps.push(now);
  rateLimitWindows.set(userId, timestamps);
  return false;
}

function encodeSse(payload: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

function parseToolCall(event: string): OllamaToolCall {
  return JSON.parse(event.replace("__tool_call:", "")) as OllamaToolCall;
}

function systemPrompt(context: Awaited<ReturnType<typeof getMinimalUserContext>>) {
  return [
    "You are Cadence, a privacy-first financial assistant.",
    "Every financial figure, balance, amount, date, and transaction claim must come from tool results.",
    "If tool results are empty, say that the connected data does not contain enough evidence.",
    "Do not invent balances, transactions, subscriptions, due dates, or projected cash.",
    `Context: account_count=${context.accountCount}; last_transaction_date=${context.lastTransactionDate ?? "none"}; paycheck_profile=${JSON.stringify(context.paycheckProfile)}.`,
  ].join(" ");
}

async function runToolLoop(
  userId: string,
  messages: OllamaChatMessage[],
  controller: ReadableStreamDefaultController<Uint8Array>
): Promise<void> {
  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration += 1) {
    const toolCalls: OllamaToolCall[] = [];
    let assistantContent = "";

    for await (const event of streamOllamaChat(messages, financialTools)) {
      if (event.startsWith("__tool_call:")) {
        toolCalls.push(parseToolCall(event));
        continue;
      }

      assistantContent += event;
      controller.enqueue(encodeSse({ type: "delta", content: event }));
    }

    messages.push({
      role: "assistant",
      content: assistantContent,
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
    });

    if (toolCalls.length === 0) {
      controller.enqueue(encodeSse({ type: "done" }));
      return;
    }

    for (const toolCall of toolCalls) {
      const startedAt = Date.now();
      const result = await executeTool(
        toolCall.function.name,
        toolCall.function.arguments,
        userId
      );
      console.info("Executed AI tool", {
        tool: toolCall.function.name,
        durationMs: Date.now() - startedAt,
      });
      messages.push({
        role: "tool",
        content: JSON.stringify(result),
        tool_call_id: toolCall.id,
        tool_name: toolCall.function.name,
      });
    }
  }

  controller.enqueue(
    encodeSse({
      type: "error",
      error: "The assistant reached its tool-call limit.",
    })
  );
}

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return unauthorized();
  }

  if (isRateLimited(userId)) {
    return fail("Rate limit exceeded.", 429, "RATE_LIMITED");
  }

  let body: z.infer<typeof chatRequestSchema>;
  try {
    body = chatRequestSchema.parse(await req.json());
  } catch {
    return fail("Invalid chat payload.", 400, "INVALID_PAYLOAD");
  }

  const context = await getMinimalUserContext(userId);
  const messages: OllamaChatMessage[] = [
    { role: "system", content: systemPrompt(context) },
    ...body.messages,
  ];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await runToolLoop(userId, messages, controller);
      } catch (error) {
        controller.enqueue(
          encodeSse({
            type: "error",
            error:
              error instanceof Error
                ? error.message
                : "The assistant failed to respond.",
          })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
