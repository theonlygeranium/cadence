"use client";

import { useCallback, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import { Link as LinkIcon, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ApiResponse } from "@/lib/api/responses";

type LinkTokenResponse = {
  link_token: string;
};

type ExchangeResponse = {
  itemId: string;
  sync: unknown;
};

type AuthSessionResponse = {
  user?: unknown;
} | null;

type LinkStatus = "idle" | "loading" | "ready" | "exchanging" | "connected" | "error";

function responseMessage<T>(payload: ApiResponse<T>, fallback: string): string {
  return payload.success ? fallback : payload.error.message;
}

export function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<LinkStatus>("idle");
  const [message, setMessage] = useState<string>("No institution connected");

  const exchangePublicToken = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      setStatus("exchanging");
      setMessage("Syncing accounts");

      const response = await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          public_token: publicToken,
          institution: metadata.institution
            ? {
                institution_id: metadata.institution.institution_id,
                name: metadata.institution.name,
              }
            : undefined,
        }),
      });
      const payload = (await response.json()) as ApiResponse<ExchangeResponse>;

      if (!response.ok || !payload.success) {
        throw new Error(responseMessage(payload, "Plaid exchange failed."));
      }

      setStatus("connected");
      setMessage(metadata.institution?.name ?? "Institution connected");
    },
    []
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken, metadata) => {
      void exchangePublicToken(publicToken, metadata).catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Plaid exchange failed.");
      });
    },
    onExit: (error) => {
      if (error) {
        setStatus("error");
        setMessage(error.error_message || "Plaid Link exited with an error.");
      } else if (status !== "connected") {
        setStatus(linkToken ? "ready" : "idle");
        setMessage(linkToken ? "Link ready" : "No institution connected");
      }
    },
  });

  async function handleConnect() {
    if (linkToken && ready) {
      open();
      return;
    }

    setStatus("loading");
    setMessage("Preparing Link");

    try {
      const sessionResponse = await fetch("/api/auth/session");
      const session = (await sessionResponse.json()) as AuthSessionResponse;

      if (!session?.user) {
        setStatus("error");
        setMessage("Authentication required.");
        return;
      }

      const response = await fetch("/api/plaid/link-token", { method: "POST" });
      const payload = (await response.json()) as ApiResponse<LinkTokenResponse>;

      if (!response.ok || !payload.success) {
        throw new Error(responseMessage(payload, "Plaid Link unavailable."));
      }

      setLinkToken(payload.data.link_token);
      setStatus("ready");
      setMessage("Link ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Plaid Link unavailable.");
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {message}
      </p>
      <Button
        type="button"
        onClick={handleConnect}
        disabled={status === "loading" || status === "exchanging"}
        aria-label={ready && linkToken ? "Open Plaid Link" : "Prepare Plaid Link"}
      >
        {status === "loading" || status === "exchanging" ? (
          <RefreshCw className="size-4 animate-spin" />
        ) : (
          <LinkIcon className="size-4" />
        )}
        <span>{ready && linkToken ? "Open Link" : "Connect bank"}</span>
      </Button>
    </div>
  );
}
