import { env } from "@/lib/env";
import type { OllamaTool } from "@/lib/ai/tools";

export type OllamaChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: OllamaToolCall[];
  tool_call_id?: string;
  tool_name?: string;
};

export type OllamaToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: Record<string, unknown>;
  };
};

type RawOllamaToolCall = {
  id?: string;
  type?: "function";
  function: {
    name: string;
    arguments?: Record<string, unknown> | string;
  };
};

type OllamaStreamChunk = {
  message?: {
    role?: string;
    content?: string;
    tool_calls?: RawOllamaToolCall[];
  };
  done?: boolean;
};

let toolCallCounter = 0;

function normalizeArguments(args: RawOllamaToolCall["function"]["arguments"]) {
  if (!args) {
    return {};
  }

  if (typeof args === "string") {
    try {
      const parsed = JSON.parse(args) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  return args;
}

function normalizeToolCall(call: RawOllamaToolCall): OllamaToolCall {
  toolCallCounter += 1;
  return {
    id: call.id ?? `tool-${toolCallCounter}`,
    type: "function",
    function: {
      name: call.function.name,
      arguments: normalizeArguments(call.function.arguments),
    },
  };
}

export async function* streamOllamaChat(
  messages: OllamaChatMessage[],
  tools: OllamaTool[]
): AsyncGenerator<string> {
  const response = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: env.OLLAMA_MODEL,
      messages,
      tools,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama chat request failed with status ${response.status}.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      const chunk = JSON.parse(line) as OllamaStreamChunk;

      for (const toolCall of chunk.message?.tool_calls ?? []) {
        yield `__tool_call:${JSON.stringify(normalizeToolCall(toolCall))}`;
      }

      if (chunk.message?.content) {
        yield chunk.message.content;
      }
    }
  }

  if (buffer.trim()) {
    const chunk = JSON.parse(buffer) as OllamaStreamChunk;
    for (const toolCall of chunk.message?.tool_calls ?? []) {
      yield `__tool_call:${JSON.stringify(normalizeToolCall(toolCall))}`;
    }
    if (chunk.message?.content) {
      yield chunk.message.content;
    }
  }
}
