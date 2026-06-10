"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type StreamEvent = { type: string; content?: string; error?: string };

function parseSseEvent(event: string): StreamEvent | null {
  const dataLine = event
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("data: "));

  if (!dataLine) {
    return null;
  }

  return JSON.parse(dataLine.slice(6)) as StreamEvent;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingAssistant = useRef("");

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    pendingAssistant.current = "";
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Assistant unavailable.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        streamBuffer += decoder.decode(value, { stream: true });
        const events = streamBuffer.split("\n\n");
        streamBuffer = events.pop() ?? "";

        for (const rawEvent of events) {
          const event = parseSseEvent(rawEvent);
          if (!event) {
            continue;
          }

          if (event.type === "delta" && event.content) {
            pendingAssistant.current += event.content;
            setMessages((current) => [
              ...current.slice(0, -1),
              { role: "assistant", content: pendingAssistant.current },
            ]);
          }

          if (event.type === "error") {
            throw new Error(event.error ?? "Assistant unavailable.");
          }
        }
      }

      streamBuffer += decoder.decode();
      if (streamBuffer.trim()) {
        const event = parseSseEvent(streamBuffer);
        if (event?.type === "error") {
          throw new Error(event.error ?? "Assistant unavailable.");
        }
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Assistant unavailable.");
      setMessages(nextMessages);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <header className="flex items-center justify-between border-b pb-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cadence</p>
            <h1 className="text-2xl font-semibold tracking-normal">Assistant</h1>
          </div>
        </header>

        <Card className="min-h-[70vh]">
          <CardHeader>
            <CardTitle>Financial Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-[58vh] flex-col gap-4">
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-md border bg-muted/20 p-3">
              {messages.length === 0 ? (
                <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
                  Cadence is ready.
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                        : "mr-auto max-w-[85%] whitespace-pre-wrap break-words rounded-md border bg-background px-3 py-2 text-sm"
                    }
                  >
                    {message.content || (isSending ? "..." : "")}
                  </div>
                ))
              )}
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <form className="flex gap-2" onSubmit={handleSubmit}>
              <Input
                aria-label="Message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Cadence"
              />
              <Button
                type="submit"
                disabled={!canSend}
                size="icon-lg"
                aria-label="Send message"
                title="Send message"
              >
                <SendHorizonal className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
