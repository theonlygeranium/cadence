import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CreditCard,
  Landmark,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Cadence
            </p>
            <h1 className="text-2xl font-semibold tracking-normal">
              Financial Command Center
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Self-hosted on Schubert</span>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Net Cash",
              value: "$0.00",
              detail: "Waiting for account sync",
              icon: Landmark,
              tone: "text-emerald-700",
            },
            {
              label: "Card Exposure",
              value: "$0.00",
              detail: "No credit accounts linked",
              icon: CreditCard,
              tone: "text-sky-700",
            },
            {
              label: "Subscriptions",
              value: "0",
              detail: "Detection begins after sync",
              icon: ReceiptText,
              tone: "text-amber-700",
            },
            {
              label: "Next Pay Window",
              value: "Unset",
              detail: "Pay profile not configured",
              icon: CalendarDays,
              tone: "text-violet-700",
            },
          ].map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>{metric.label}</span>
                  <metric.icon className={`size-4 ${metric.tone}`} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">
                  {metric.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletCards className="size-4" />
                Cash Flow Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  ["Today", "No synced transactions yet", "neutral"],
                  ["Next pay cycle", "Semi-monthly profile pending", "up"],
                  ["Upcoming bills", "Recurring detection pending", "down"],
                ].map(([label, detail, direction]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[6rem_1fr_auto] items-center gap-3 rounded-md border px-3 py-3 text-sm"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{detail}</span>
                    {direction === "up" ? (
                      <ArrowUpRight className="size-4 text-emerald-600" />
                    ) : direction === "down" ? (
                      <ArrowDownRight className="size-4 text-rose-600" />
                    ) : (
                      <Separator className="w-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-4" />
                AI Grounding Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-md border bg-muted/40 p-3">
                <p className="font-medium">Ollama tool loop pending</p>
                <p className="mt-1 text-muted-foreground">
                  Financial answers will be constrained to database query
                  results before chat is enabled.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground">Model</p>
                  <p className="mt-1 font-medium">qwen3.6:latest</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground">Data Scope</p>
                  <p className="mt-1 font-medium">Per user</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
