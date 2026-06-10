# Cadence: AI-Powered Personal Finance Platform
## Product Strategy & Architecture Proposal

**Prepared by:** WRITER Agent (Principal Strategist)
**Date:** June 9, 2026
**Version:** 1.0 — Initial Proposal
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Market Research & Competitive Analysis](#market-research)
3. [Product Gaps & Strategic Opportunities](#product-gaps)
4. [Product Naming, Positioning & Vision](#naming-and-vision)
5. [Feature Set & Product Roadmap](#feature-set)
6. [Technical Architecture](#technical-architecture)
7. [AI Strategy & LLM Integration](#ai-strategy)
8. [Plaid Integration Plan](#plaid-integration)
9. [Design System & Mobile-Responsive UX](#design-and-ux)
10. [Multi-Agent Partnership & GitHub Workflow](#multi-agent-plan)
11. [Monetisation Strategy](#monetisation)
12. [Open Questions & Next Steps](#next-steps)

---

## 1. Executive Summary {#executive-summary}

The personal finance budgeting market is in structural transition. Mint's shutdown in early 2024 displaced millions of users and created a demand vacuum that the surviving incumbents — YNAB, Monarch Money, and Copilot — have only partially addressed 【web-snapmessages-d8303f50】. Each of those incumbents occupies a narrow behavioral niche: YNAB owns active, zero-based budgeters willing to engage manually; Monarch owns the automation-first household segment; Copilot owns design-conscious Apple users who will never own an Android device 【web-parallect-98dd4834】. No single product addresses the full spectrum of what an analytically sophisticated personal user — aware of their recurring service creep, monitoring credit card cashflow, dependent on semi-monthly paychecks, and willing to employ AI — actually needs.

This proposal defines **Cadence**, a web-first, AI-native personal finance platform designed to occupy precisely that vacancy. The name is intentional: cadence refers both to the rhythmic timing of recurring financial obligations (bills, subscriptions, paycheck cycles) and to the principled, orchestrated way the system manages money across time. Where competitors treat AI as a feature appended to a ledger, Cadence treats AI as the operating layer through which every financial insight, recommendation, and alert is generated. Where competitors treat bank sync as the sole path to data, Cadence treats it as one of several first-class input channels, respecting privacy-conscious users. Where competitors optimise for one platform, Cadence is built web-first and mobile-responsive from day one, deployable on a self-hosted custom AI server with LLM models under your direct control.

The platform will be built entirely by AI agents — this document serves as the specification from which those agents operate. WRITER Agent functions as Principal Strategist and Product Architect. Codex and ancillary build agents execute implementation against specifications defined here. The result is a product that is, from its inception, an artifact of the very AI-native paradigm it seeks to embody.

---

## 2. Market Research & Competitive Analysis {#market-research}

### 2.1 The Incumbent Landscape

The 2026 personal finance app market has consolidated around a small set of paid subscription products following the Mint shutdown, with a well-defined tiering structure by price and philosophy 【web-fintechessential-8bd66fc6】:

| App | Annual Cost | Core Philosophy | Primary Strength | Primary Weakness |
|---|---|---|---|---|
| YNAB | $109/yr | Zero-based budgeting, active engagement | Behavior change, debt elimination | Price, learning curve, credit card UX |
| Monarch Money | $99.99/yr | Comprehensive financial OS | All-in-one dashboard, couples | Feature bloat, complexity |
| Copilot | $95/yr | Design-led, AI autocategorization | UX polish, Apple ecosystem | iOS/Mac only, no Android |
| Simplifi | ~$72/yr | Lightweight, watchlist-driven | Ease of use, price | Depth of AI features |
| EveryDollar | $79.99/yr | Simple zero-based (Ramsey) | Simplicity, brand loyalty | Narrow philosophy, limited AI |
| Empower | Free | Net worth / investment tracking | Free, investment analytics | Upsell to wealth mgmt, limited budgeting |
| Rocket Money | $6–12/mo | Bill negotiation, mass market | Large user base, bill negotiation | Limited analytical depth |

YNAB commands 4.8 out of 5 stars on the App Store across 83,262 ratings as of March 2026, with an "Excited" sentiment profile 【web-marlvel-aee9fd28】. Yet its dominant criticism is structural: a 142% price increase since 2015 to $109 per year, a credit card handling model that even financially sophisticated users describe as requiring a new conceptual vocabulary, and bank sync failures that generate the plurality of its one-star reviews 【web-productivewithchris-99f46a8a】. The 2025 mobile redesign — which embraced Apple's Liquid Glass aesthetic — was genuinely acclaimed, suggesting users are highly responsive to visual quality improvements when the functional substrate is already trusted 【web-apps-b5d00933】.

Copilot represents the most credible design threat in the market. It earned Apple Design Award finalist status, reached profitability in 2023 on 100,000+ subscribers, and launched a web application in December 2025 after years as iOS-only 【web-useluminix-0311cc0e】. Its AI-powered categorization reportedly achieves 95%+ accuracy, and its "subscription creep detection" feature saves users an average of $86 per month in identified recurring waste 【web-snapmessages-d8303f50】. However, its permanent exclusion of Android users constitutes a structural cap on total addressable market that no design excellence can overcome.

Monarch Money stepped into the post-Mint vacuum most aggressively, offering the broadest feature set at $99.99 per year 【web-millionspro-2da14721】. Its AI financial coach now provides 90-day cash flow forecasting, which is the most forward-looking feature in the competitive set. The weakness is precisely its strength inverted: comprehensive breadth creates perception of complexity, and users seeking simple budgeting feel lost in a dashboard designed for holistic financial management 【web-parallect-7335540f】.

### 2.2 User Sentiment: What People Love

Across App Store reviews, Reddit, Trustpilot, and third-party analytical aggregations, the consistent positive signals in personal finance apps reduce to several precise themes:

**Behavioral transformation.** YNAB users who engage fully report saving an average of $6,000 in their first year by YNAB's own survey data 【web-productivewithchris-99f46a8a】. The mechanism is not the technology but the forced deliberateness the app's zero-based structure imposes. Users respond emotionally and loyally to tools that produce measurable change in financial circumstances, not merely tools that display information.

**Design quality as trust signal.** Copilot's success demonstrates that premium visual design is not merely aesthetic — it functions as a proxy for product quality and builds the kind of trust required to grant a tool access to financial accounts. Users who migrate from poorly designed apps to well-designed ones consistently cite the visual upgrade as a primary reason for the switch 【web-useluminix-0311cc0e】.

**Automation that works invisibly.** When bank sync functions correctly and transactions are categorized accurately without user intervention, users report high satisfaction and rarely mention it — precisely because it works. The delight is in the absence of friction. This is the correct baseline expectation, not a differentiator.

**Insight over data.** Users increasingly distinguish between apps that surface data and apps that surface understanding. Monarch's 90-day forecasting and Copilot's subscription creep detection are valued not because the underlying data is novel but because the interpretive layer reduces cognitive load and converts raw numbers into actionable intelligence.

### 2.3 User Sentiment: What People Hate

The complaint profile across the competitive set is remarkably consistent and structurally revealing 【web-parallect-7335540f】:

**Bank sync fragility.** This is the single dominant pain point across YNAB, Monarch, and Copilot alike. Plaid, MX, and Finicity-based connections fail frequently, produce duplicate transactions, fail silently without user notification, and require repeated re-authentication. This problem cannot be fully solved at the application layer given the structural dependency on aggregator infrastructure, but it can be meaningfully mitigated through transparent error messaging, automatic re-authentication prompts, graceful fallback to manual import, and proactive user notification when a connection state degrades 【web-trustpilot-0c3bc5d9】.

**Pricing opacity and increases.** YNAB's 100% price increase with approximately one month's notice generated significant negative sentiment across its user base, including among users who otherwise expressed strong product loyalty 【web-apps-02225fb3】. The absence of pricing disclosure prior to account creation was independently cited as deceptive. Users in 2026 have refined price sensitivity given the competitive alternatives available.

**Credit card conceptual complexity.** YNAB's credit card handling model — in which budgeted spending automatically creates a payment allocation — is the most frequently cited source of confusion among new users 【web-productivewithchris-99f46a8a】. This is a specific product design failure with known resolution patterns: direct visualization of credit card balances against available credit, clear payment scheduling, and explicit cash-flow impact projections.

**Privacy concerns with live data sync.** A growing and measurable user segment actively rejects Plaid-based automation due to privacy concerns, preferring manual entry or file-based import (CSV/OFX) 【web-parallect-7335540f】. No incumbent has built a genuinely privacy-first mode that provides AI-powered categorization on manually entered data, leaving this segment systematically underserved.

**Feature bloat.** Monarch's comprehensiveness, while a strength for power users, creates a perception of overwhelming complexity for users who want focused budgeting. The absence of a "simple mode" or progressive disclosure architecture is a specific product gap.

---

## 3. Product Gaps & Strategic Opportunities {#product-gaps}

The research identifies five structurally distinct opportunities that no incumbent adequately addresses. Cadence is designed to capture all five simultaneously.

### Gap 1: Semi-Monthly Cash Flow Intelligence

No existing budgeting app is optimized for the semi-monthly paycheck cycle — a bi-monthly pay cadence where understanding which bills land before and after each paycheck is essential to avoiding overdrafts and credit dependency. YNAB's zero-based model approximates this with manual allocation but provides no automatic detection of the temporal gap between recurring bill due dates and upcoming pay dates. This specific use case — knowing precisely which obligations fall in each pay window and whether current balances are sufficient — is unaddressed by any competitor and represents one of the highest-value features Cadence can deliver.

### Gap 2: Subscription & Recurring Service Intelligence

Copilot's subscription creep detection saving users $86/month average is the clearest evidence in the market that users are systematically unaware of what they are paying for on a recurring basis 【web-snapmessages-d8303f50】. The opportunity is not merely to detect existing subscriptions but to categorize them by utility, flag dormant or unused services, model the annualized cost of subscription portfolios, and proactively surface cancellation recommendations with projected savings. Cadence's AI layer should treat recurring service portfolio management as a first-class product surface, not an incidental discovery.

### Gap 3: Credit Card Cash Flow Clarity

The confusion YNAB creates around credit card handling is a solvable problem in interface design. What users actually need is a clear answer to three questions: What is my current credit card balance? What is due by what date? Do I have sufficient funds in checking to pay it? The correct mental model is a cash flow calendar — a temporal view of inflows, outflows, credit obligations, and available balances — not a category allocation system. Cadence should build this calendar view as a primary navigation surface.

### Gap 4: True Privacy-First Flexibility

Users who are unwilling to grant third-party aggregators access to their financial credentials constitute a real and underserved segment. Cadence should provide three parallel input paths equally: Plaid automated sync, CSV/OFX/QIF file import, and manual transaction entry — all feeding into the same AI-categorization and insight engine 【web-parallect-7335540f】. The AI layer should function identically regardless of input method, removing the implicit penalty that all current apps impose on manual users.

### Gap 5: Self-Hosted, User-Controlled AI

The emerging "conversational finance surface" trend — in which general-purpose LLMs partially replace dedicated finance apps for users with sophisticated prompting skills — represents a threat to all incumbent apps 【web-thorstenmeyerai-1cdf846e】. Cadence's response is to be the most capable conversational AI finance tool available: a purpose-built financial AI running on infrastructure the user controls, with no data leaving the user's server to a third-party LLM provider unless explicitly opted into. This positions Cadence not as a data-collection platform but as a personal financial intelligence system with institutional-grade privacy by default.

---

## 4. Product Naming, Positioning & Vision {#naming-and-vision}

### 4.1 Recommended Name: **Cadence**

The name Cadence was selected through systematic evaluation against three criteria: semantic precision relative to the product's core value proposition, phonetic quality and brand memorability, and differentiation from existing market entrants.

**Semantic precision.** The word cadence carries multiple relevant meanings simultaneously. In music and language, cadence denotes a rhythmic sequence — the ordered, repeating pattern of a financial life: paychecks arriving, bills falling due, subscriptions renewing. In athletics, cadence refers to the pace of movement, sustainable and calibrated. In professional communication, a "communication cadence" is the deliberate scheduling of interactions to ensure nothing is missed. All three meanings apply directly to what Cadence the product delivers: an ordered, sustainable, deliberate rhythm for managing personal financial life.

**Phonetic quality.** The word is two syllables, ends on a soft consonant, and carries both clarity and sophistication. It is uncommon in financial product naming, creating immediate recall differentiation.

**Domain and trademark.** The `cadence.finance` or `getcadence.app` domain pattern is available and brandable. No direct competitor uses this name.

#### Alternative Names for Consideration

- **Meridian** — The intersection point of all financial data streams; implies a bird's-eye view and the concept of alignment. More abstract; slightly harder to explain in a tagline.
- **Fathom** — To understand deeply; implies analytical depth and the action of fully comprehending one's financial position. Strong verb energy. `fathom.money` is a compelling domain pattern.
- **Cortex** — The cognitive layer of financial intelligence; overtly positions the AI as the product's brain. Most technology-forward of the three alternatives; may appeal more to early adopters than mainstream users.
- **Parity** — The state of balance; implies financial equilibrium as a goal state. Clean, minimal, European-style naming.

**Recommendation:** Deploy **Cadence** for the initial build and personal use phase. Evaluate rebranding to Meridian or Fathom if a commercial launch targets a broader non-technical audience.

### 4.2 Tagline Options

- *"Know your rhythm. Control your money."*
- *"Every dollar, every deadline, every decision — in sync."*
- *"Financial intelligence at your cadence."*
- *"Built for how you actually get paid."*

**Recommendation:** *"Know your rhythm. Control your money."* — this tagline captures the timing-intelligence angle while remaining accessible.

### 4.3 Positioning Statement

Cadence is an AI-native personal finance platform for individuals who want to understand their money at the level of mechanism rather than summary. Unlike passive trackers that aggregate data without interpretation, or prescriptive budgeting apps that impose rigid methodologies, Cadence provides a live, intelligent financial model of your life — connecting banks through Plaid, understanding your paycheck cadence, identifying every dollar committed to recurring obligations, and surfacing actionable intelligence in natural language. It is the financial operating system for people who want to be informed, not instructed.

### 4.4 Product Vision

The five-year product vision for Cadence is a personal financial intelligence system that functions as a knowledgeable financial advisor available continuously — one that knows not only your current account balances but your financial trajectory, your behavioral patterns, your debt payoff timeline, your subscription waste, and the precise window between today and your next paycheck. The initial scope is intentionally focused: bank connectivity, cash flow calendar, recurring obligation management, and AI-powered insight. The architectural decisions made in the initial build — modular AI layer, self-hosted LLMs, privacy-first data model — are chosen specifically to support the evolution toward this vision without requiring a re-architecture.

---

## 5. Feature Set & Product Roadmap {#feature-set}

### 5.1 Phase 1: Core (Months 1–3)

The initial build prioritizes the features that directly address the identified gaps and satisfy the personal use case.

**Financial Account Dashboard.** A unified view of all connected accounts — checking, savings, credit cards, and investment accounts — displaying current balances, recent transactions, and account health indicators. The dashboard is organized around cash flow state, not account type: the primary question it answers is "where does my money stand right now and where is it going?"

**Plaid Bank Connection.** Full Plaid Link integration supporting Multi-Item Link (connecting multiple institutions in a single session), OAuth for major banks, and real-time balance retrieval 【web-plaid-1b73ebad】. Connection health monitoring with proactive re-authentication prompts when connections degrade. Automatic sync with configurable frequency.

**Cash Flow Calendar.** A calendar view that plots: (a) paycheck inflow dates based on detected or user-configured pay schedule — specifically semi-monthly — (b) recurring bill due dates, (c) subscription renewal dates, and (d) credit card payment due dates. Color-coded by category (income green, fixed obligations red, discretionary orange, credit payments yellow). Each calendar event is clickable with drill-down to transaction history and projected account balance at that point in time.

**Transaction Management.** Full transaction list with AI-powered categorization, manual override capability, split transactions, notes, and receipt attachment (mobile camera capture). CSV/OFX/QIF import as a fully supported alternative to Plaid sync. Manual entry for cash transactions. Search and filter by date, amount, category, merchant, and account.

**Recurring Services Intelligence.** Automatic detection of recurring charges from transaction history, powered by pattern recognition in the AI layer. Organized into a subscription portfolio view showing: service name, amount, frequency, annualized cost, last charge date, and next projected charge date. Dormancy indicator for services with no detected usage signals. One-click cancellation link finder (AI-assisted search).

**Budget Planning.** Zero-based budget framework with category-level allocation, flexible enough to accommodate envelope-style or percentage-based approaches. Budget vs. actual visualization with projected month-end outcome. Visual alerts when category spending approaches limits. No forced methodology — the user selects their preferred budgeting model.

**AI Financial Assistant.** A conversational interface powered by the self-hosted LLM, capable of answering natural-language questions about financial data: "What did I spend on restaurants last month compared to the month before?", "How much money will I have on July 15th after paying my rent?", "What subscriptions have I paid for but haven't used in 90 days?". The AI has full read access to all financial data in the system and generates responses grounded in actual user data, not generic financial advice.

**Bill Due Date Alerts.** Configurable notifications for upcoming bill due dates, low balance warnings relative to upcoming obligations, and paycheck-to-paycheck window alerts. Because this is a web application, notifications are delivered via email and/or browser push.

### 5.2 Phase 2: Intelligence Deepening (Months 4–6)

**Spending Pattern Analysis.** AI-generated weekly and monthly spending narratives: which categories increased or decreased, which merchants are new, which spending events were anomalous. Trend visualizations with regression lines over 3/6/12 month windows.

**Debt Payoff Planner.** Visualization of credit card and loan balances over time under different payment scenarios — minimum payments, fixed additional payments, avalanche vs. snowball strategies. Integrates directly with Plaid Liabilities API for accurate balance and interest rate data 【web-plaid-3c684d22】.

**Net Worth Tracker.** Aggregation of all assets (checking, savings, investments) and liabilities (credit cards, loans) into a net worth timeline. Investment account integration via Plaid Investments API with sector/industry breakdown and performance attribution.

**Receipt Capture & OCR.** Mobile-optimized camera interface for photographing receipts. AI extraction of merchant, amount, date, and line items. Automatic matching to existing transactions or creation of new manual entries.

**CSV Export & Reporting.** Downloadable transaction exports, budget reports, category summaries, and net worth snapshots in CSV and PDF formats. Useful for tax preparation and financial review with an accountant.

### 5.3 Phase 3: Monetisation & Scale Readiness (Months 7–12)

**Multi-User / Household Mode.** Shared budget visibility for couples and household members. Granular permission controls (read-only vs. edit access by category).

**AI Simulation Engine.** Scenario modeling: "What if I paid off my car loan in 18 months instead of 36?" or "What if I reduced restaurant spending by 30%?". The AI generates projected financial state under each scenario using actual historical spending data as the baseline.

**Savings Goal Tracking.** Visual progress toward defined savings goals with AI-calculated monthly contribution requirements and milestone projection.

**Mobile App Shell.** Progressive Web App packaging for iOS and Android home screen installation, enabling native-feeling mobile access without App Store distribution requirements during the personal-use phase.

**API Access (Developer Mode).** For power users who want programmatic access to their financial data: a personal API exposing account balances, transactions, and budget state. Enables integration with custom scripts, spreadsheets, or home automation systems.

---

## 6. Technical Architecture {#technical-architecture}

### 6.1 Design Principles

The architecture of Cadence is governed by four principles that are non-negotiable regardless of implementation timeline:

**Privacy-by-default.** Financial data is among the most sensitive information a person generates. No user data is transmitted to third-party services without explicit opt-in. The AI layer runs on self-hosted infrastructure. Plaid credentials are never stored; only Plaid access tokens are retained, encrypted at rest, and associated with individual user accounts.

**Modularity.** Each major subsystem — data ingestion (Plaid, CSV, manual), AI reasoning, notification delivery, visualization, export — is designed as an independently deployable module. This enables the multi-agent build workflow to proceed in parallel across subsystems without blocking dependencies.

**Progressive enhancement.** The application is fully functional without JavaScript on the server-rendered critical paths. Interactive enhancements layer on top of a functional baseline. This approach produces the fastest perceived performance on mobile networks, which is essential for on-the-go use cases like receipt capture and quick balance checks.

**Type-safety throughout.** TypeScript is enforced at every layer, from database schema (Drizzle or Prisma ORM) through API handlers (Zod validation) to React components. Runtime type errors in financial calculations are unacceptable.

### 6.2 Recommended Technology Stack

The following stack is drawn from the dominant pattern observed across 2025-2026 finance application repositories and represents the current consensus of best practices for this application category 【web-github-42d55ee9】【web-github-dfac4543】【web-github-4372348b】:

**Frontend & Framework**
- **Next.js 16** (App Router, React Server Components) — The App Router's server-first model enables secure financial data fetching without client-side credential exposure. React Server Components reduce client-side JavaScript bundle size, critical for mobile performance.
- **React 19** — Latest concurrent rendering features for smooth UI interactions.
- **TypeScript 5** — Strict mode enabled throughout.

**Styling & Component System**
- **Tailwind CSS v4** — Utility-first styling with the v4 performance improvements.
- **shadcn/ui** — Headless, accessible, and composable component library that renders as first-class native code rather than an opaque dependency. Ideal for a design system that will evolve over time 【web-github-5a8513ef】.
- **Radix UI** — Primitive accessible components underpinning shadcn/ui.
- **Framer Motion** — Declarative animation library for entrance animations, transitions, and micro-interactions. Designed for additive use; all animations can be removed or replaced without structural refactoring.
- **GSAP** — Advanced animation library for more complex timeline-controlled sequences in future simulation features 【web-github-74255eb7】.

**Data Visualization**
- **Recharts** — React-native chart library covering area, line, bar, pie, and composed charts. The standard in 2025-2026 finance application builds 【web-github-4372348b】.
- **TanStack Table v8** — Headless data table for transaction lists with sorting, filtering, and virtualization for large datasets.

**Backend & API**
- **Next.js API Routes / Route Handlers** — Server-side API surface collocated with the frontend, reducing deployment complexity on self-hosted infrastructure.
- **Node.js 22 LTS** — Runtime for the API layer.
- **Express.js 5** (optional) — If API surface grows to warrant separation, an Express-based microservice handles Plaid webhook processing and background job scheduling independently.

**Database**
- **PostgreSQL** — The financial data store. ACID compliance, JSON column support for flexible metadata storage, and mature tooling make it the only appropriate choice for a financial application 【web-github-1632fe32】.
- **Drizzle ORM** — Type-safe, lightweight ORM with excellent Next.js integration and SQL-first philosophy. Generates strong TypeScript types from schema definitions.
- **Neon** (serverless PostgreSQL) — For the initial personal-use deployment phase allowing serverless scale-to-zero. Migrates trivially to dedicated PostgreSQL on the custom AI server when traffic warrants.

**Authentication**
- **NextAuth v5 / Auth.js** — Pluggable authentication with support for credential-based login, OAuth providers, and JWT session management. Email-based magic links for convenient mobile access.

**AI & LLM Integration**
- **Self-hosted LLM** (via custom AI server) — Primary reasoning model for the financial assistant. API-compatible with OpenAI's `/chat/completions` endpoint format, enabling plug-and-play switching between local models and hosted providers.
- **Vercel AI SDK** — Streaming AI response handling, hooks for React integration, and tool-calling abstractions compatible with both OpenAI-format and self-hosted models.
- **LangChain.js** or **custom agent framework** — For multi-step reasoning chains (e.g., "analyze my spending and produce a monthly summary") that require tool use, memory, and structured output.

**Background Jobs & Scheduling**
- **node-cron** — Scheduled jobs for Plaid transaction sync, recurring charge detection, bill reminder notifications, and daily AI-generated financial summaries 【web-github-1632fe32】.
- **Bull / BullMQ** (with Redis) — Job queue for webhook processing, email delivery, and long-running AI analysis tasks.

**File Handling**
- **Multer** — Multipart form handling for receipt image upload.
- **Cloudinary** (or local storage on self-hosted server) — Receipt image storage and thumbnail generation.
- **Tesseract.js** / AI-based OCR — Receipt text extraction.

**Validation & Type Safety**
- **Zod v4** — Schema validation for all API inputs, Plaid webhook payloads, and AI-generated outputs 【web-github-1632fe32】.

**Testing**
- **Vitest** — Unit and integration testing.
- **Playwright** — End-to-end browser automation testing for critical financial flows (login, bank connection, transaction categorization, budget creation).
- **GitHub Actions** — CI/CD pipeline: lint → type-check → unit test → integration test → build → deploy 【web-github-4372348b】.

**Email Notifications**
- **Nodemailer** with SMTP — Self-hosted email delivery for bill reminders, weekly summaries, and low balance alerts.
- **React Email** — Typed, component-based email template system.

**Deployment**
- **Docker + Docker Compose** — Containerized deployment on the custom AI server. Each service (Next.js app, PostgreSQL, Redis, LLM server) runs in an isolated container with defined resource limits.
- **Nginx** — Reverse proxy with TLS termination, rate limiting, and static asset caching.

### 6.3 System Architecture Diagram (Textual)

```
                        ┌─────────────────────────────────┐
                        │         CADENCE PLATFORM         │
                        │     (Self-Hosted AI Server)      │
                        └─────────────────────────────────┘
                                        │
          ┌─────────────────────────────┼──────────────────────────┐
          │                             │                          │
   ┌──────┴──────┐               ┌──────┴──────┐            ┌──────┴──────┐
   │  Next.js    │               │ PostgreSQL   │            │  LLM Server  │
   │  App        │◄──────────────│  Database    │            │  (local)     │
   │  (Frontend  │               │  (Neon/PG)   │            │              │
   │  + API)     │               └─────────────┘            └─────────────┘
   └──────┬──────┘                                                  ▲
          │                                                         │
          │  ┌──────────────┐      ┌───────────────┐               │
          ├─►│  Plaid API   │      │  Redis Queue   │               │
          │  │  (External)  │      │  (BullMQ)      │               │
          │  └──────────────┘      └───────────────┘               │
          │                                │                        │
          │  ┌──────────────┐      ┌───────┴───────┐               │
          ├─►│  File Import │      │  Background    │───────────────┘
          │  │  (CSV/OFX)   │      │  Jobs (cron)   │
          │  └──────────────┘      └───────────────┘
          │
          │  ┌──────────────┐
          └─►│  Manual Entry│
             │  (forms)     │
             └──────────────┘
```

### 6.4 Data Model (Core Entities)

The database schema centers on seven primary entities:

- **User** — authentication, profile, pay schedule configuration, notification preferences
- **Institution** — Plaid institution metadata (institution ID, access token, sync status)
- **Account** — bank account details (type, balance, currency, Plaid account ID, manual flag)
- **Transaction** — full transaction record (amount, date, merchant, category, AI-assigned category, user-override category, notes, receipt path, import source)
- **RecurringCharge** — detected subscription/recurring service (merchant, amount, frequency, detected date, user-confirmed flag, dormancy status)
- **Budget** — budget period and category allocations
- **BillDueDate** — user-defined or AI-detected bill obligations with due dates, amounts, and linked account
- **SyncLog** — Plaid sync history, error states, and recovery actions for audit and debugging

---

## 7. AI Strategy & LLM Integration {#ai-strategy}

### 7.1 Philosophy: AI as the Operating Layer

The distinction between "an app with AI features" and "an AI-native application" is architectural, not cosmetic. In a conventional budgeting app, AI is added to an existing ledger system as an enhancement — a categorization model here, a chatbot widget there. In Cadence, the AI layer is the primary interface through which financial data becomes meaningful. Every insight, summary, alert, and recommendation originates from the AI layer, which has structured read access to all user financial data.

This design choice has a specific implication: the application must be built so that the LLM can be replaced, upgraded, or swapped between providers without any changes to the product experience. The AI layer is accessed through a unified internal API that abstracts model provider details, enabling Cadence to run local models on the self-hosted server in the default configuration while optionally routing to hosted providers (OpenAI, Anthropic, or other inference endpoints) for specific tasks when the user opts in.

### 7.2 Self-Hosted LLM Architecture

The custom AI server that will host Cadence is assumed to expose an OpenAI-compatible `/v1/chat/completions` API endpoint. This is the standard interface supported by virtually all modern local LLM serving frameworks (Ollama, vLLM, LM Studio, llama.cpp with a server wrapper) and enables the application to use the Vercel AI SDK or direct fetch calls without provider-specific SDKs.

The recommended local model architecture for financial reasoning tasks is a quantized instruction-tuned model in the 8B–70B parameter range (e.g., LLaMA 3.1 70B Instruct, Mistral Large, or equivalent). Financial reasoning requires: precise arithmetic (addressed via tool-calling rather than model computation), structured JSON output (addressed via constrained decoding), factual grounding in user data (addressed via retrieval-augmented generation over the user's transaction database), and resistance to hallucination on numerical claims (addressed via explicit citation requirements in the system prompt).

When larger or more capable reasoning is required for complex scenario modeling, the architecture should route to a dedicated hosted endpoint (configured in environment variables) without changing the application code path.

### 7.3 Core AI Capabilities

**Conversational Financial Assistant.** The primary user-facing AI interface. The assistant is provided a structured context window on each invocation containing: current account balances, recent transaction summary, active budget allocations, upcoming bill dates, and the user's configured pay schedule. It responds to natural-language queries with grounded, citation-capable answers. Example interactions:

- *"Will I be able to pay my rent on the 15th?"* → The AI retrieves the rent bill's due date and amount from BillDueDate records, the current checking balance from Account records, and all scheduled outflows between today and the 15th from RecurringCharge and BillDueDate tables, then calculates whether the projected balance is sufficient.
- *"What's my biggest spending category this month compared to last month?"* → Aggregation query over Transaction records grouped by category, formatted as a comparative narrative.
- *"Which subscriptions haven't I used in three months?"* → Cross-reference of RecurringCharge records with user-provided dormancy signals or absence of transaction activity from the merchant.

**Automatic Transaction Categorization.** On each Plaid sync or import, new transactions are passed to the AI categorization endpoint with merchant name, amount, and transaction description. The model assigns: a primary category (from a defined taxonomy), a subcategory, a recurring/one-time flag, and a confidence score. Low-confidence categorizations are surfaced for user review. User corrections are stored and used as few-shot examples in future categorization prompts (lightweight personalization without full fine-tuning).

**Recurring Charge Detection.** A background job runs weekly over the transaction history to identify recurring charge patterns: same merchant, similar amount, regular temporal interval. The AI layer validates pattern candidates against a confidence threshold before surfacing them in the Recurring Services dashboard. This is a structured reasoning task — the model receives a JSON array of charge candidates with frequency statistics and returns a structured JSON verdict per candidate.

**Paycheck Cadence Detection.** On first use (and re-detection if the pattern changes), the AI analyzes deposit transaction history to identify the pay schedule: weekly, bi-weekly, semi-monthly, or monthly. Semi-monthly detection is specifically tuned to the 1st/15th or similar fixed-date patterns. The detected schedule is presented to the user for confirmation and stored in the User record. All cash flow calendar projections use this schedule as their temporal baseline.

**Weekly Financial Digest.** An automated narrative report generated each Monday summarizing the prior week: total spending by category vs. budget, notable merchant activity, upcoming bills in the next 14 days, and one AI-generated action recommendation (e.g., "Your restaurant spending was 40% above your monthly allocation in week one — consider reducing this week"). Delivered via email and available in-app.

**Anomaly Detection.** Continuous monitoring of transactions for patterns that deviate from the user's historical baseline: unusually large transactions, new recurring charges that weren't present in the prior period, duplicate charges, and foreign transaction activity. Anomalies are surfaced as alerts with full transaction context.

### 7.4 AI Integration Architecture

The AI integration uses a layered abstraction:

```
User Interface
      │
      ▼
AI Service Layer (internal API endpoint)
  ┌─────────────────────────────────────────┐
  │  Context Builder                        │
  │  (pulls structured data from PostgreSQL)│
  │           ▼                             │
  │  Prompt Constructor                     │
  │  (assembles system prompt + context)    │
  │           ▼                             │
  │  LLM Router                             │
  │  (local server │ hosted provider)       │
  │           ▼                             │
  │  Response Parser                        │
  │  (Zod schema validation on outputs)     │
  │           ▼                             │
  │  Response Formatter                     │
  │  (markdown → UI component mapping)      │
  └─────────────────────────────────────────┘
      │
      ▼
Client Component (streaming response)
```

All AI outputs that reference financial amounts or dates are validated against the database before being returned to the user. If the AI generates a claim (e.g., "your rent is $2,100") that cannot be verified against a transaction or bill record, the response is flagged with a low-confidence indicator encouraging the user to verify manually. This architectural constraint prevents numerical hallucination from reaching the user as authoritative financial information.

### 7.5 Future AI Capabilities (Phase 2+)

**Scenario Simulation Engine.** A structured planning tool where the user defines a financial scenario (e.g., "pay off Visa card in 12 months") and the AI projects the required monthly payment, the impact on cash flow across each pay period, and the total interest saved. Scenarios update dynamically as underlying data changes.

**Natural-Language Budget Creation.** A guided onboarding flow where the user describes their financial situation in natural language — "I make $5,200 after tax twice a month, my rent is $2,400, and I'm trying to pay off $8,000 in credit card debt" — and the AI generates a complete initial budget from the description, which the user then refines.

**Proactive Financial Coaching.** Background analysis that generates proactive recommendations without being prompted: "You've been consistently overspending your grocery budget for three months — here's a projection of the annual impact and three specific adjustments that would bring it into balance."

---

## 8. Plaid Integration Plan {#plaid-integration}

### 8.1 Plaid Product Selection

Cadence will integrate the following Plaid products, in priority order:

**Transactions** (Phase 1, core) — The primary data feed for all spending analysis, categorization, and cash flow modeling. The Plaid Transactions API provides categorized transaction data with AI-enhanced categorization that achieved a +10% improvement in primary category accuracy and +20% in subcategories in 2025. Real-time webhooks (`TRANSACTIONS_SYNC`) ensure the Cadence database stays current without polling.

**Auth** (Phase 1, core) — Account and routing number verification for any payment features added in Phase 3. Database Auth (API-based account verification against Plaid's network) is available without requiring users to re-enter credentials.

**Balance** (Phase 1, core) — Real-time balance retrieval via `/accounts/balance/get` for the dashboard and cash flow projections. Combined with transaction data, enables accurate projected balance calculations at any future date.

**Liabilities** (Phase 2) — Credit card and loan balance data including outstanding balance, credit limit, minimum payment due, next payment date, and interest rate. This is the essential data source for the credit card clarity feature and debt payoff planner. Integration with the Cash Flow Calendar provides explicit due date awareness.

**Investments** (Phase 2) — Investment account holdings including fixed income details, sector/industry tags, and option data. Enables net worth tracking with investment attribution.

**Income / Bank Income** (Phase 2) — Automated income verification and paycheck pattern detection as a supplement to the transaction-based pay schedule detection.

### 8.2 Plaid Link Implementation

The integration uses **Multi-Item Link**, which allows users to connect multiple financial institutions in a single Link session, providing a complete financial picture in one onboarding flow rather than requiring repeated re-authentication per institution. This is specifically suited to a personal finance use case where users often have checking, savings, and credit accounts at two or more institutions.

OAuth support is implemented for all major US banks that require it, including Bank of America (noting the upcoming 2026 API migration requiring OAuth), Chase, Wells Fargo, and Capital One. The Plaid Link flow handles OAuth routing automatically; the implementation provides the required `redirect_uri` configuration and handles the OAuth callback in the Next.js route handler.

### 8.3 Webhook Architecture

Plaid webhooks are the mechanism through which live data reaches Cadence without polling. The webhook handler is a dedicated Next.js API Route that:

1. Validates the webhook signature using Plaid's JWT-based verification
2. Routes by webhook type to the appropriate handler
3. Enqueues the processing job in BullMQ for async execution
4. Returns 200 immediately to prevent Plaid retry storms

Key webhook types handled:

- `SYNC_UPDATES_AVAILABLE` — New transactions available; triggers incremental `/transactions/sync` call
- `DEFAULT_UPDATE` — Balance or account data changed
- `ERROR` — Item authentication failure (triggers user re-authentication prompt)
- `ITEM_LOGIN_REQUIRED` — Credentials expired; sends user notification with re-link flow deeplink
- `NEW_ACCOUNTS_DETECTED` — New accounts added to a linked institution

### 8.4 Connection Resilience

Given that bank sync fragility is the dominant pain point across all competing applications, Cadence implements a specific resilience layer:

**Connection Health Dashboard.** Each linked institution displays a health indicator: Connected (green), Degraded (yellow — sync succeeding but with delayed data), Re-authentication Required (orange), or Error (red). Users never discover a broken connection by noticing stale data; they are proactively notified.

**Graceful Degradation.** When a Plaid connection enters an error state, the affected account displays its last-known balance with a timestamp and a visible "Data as of [date]" indicator. A one-click re-authentication button is displayed inline.

**Fallback Import.** Any account experiencing connection issues is immediately offered a CSV/OFX import pathway. The import parser accepts files directly from the institution's download feature (Chase, Bank of America, and most major banks support OFX export). Imported transactions are deduplicated against existing records using a fuzzy-match algorithm (date ± 1 day, amount exact, merchant approximate).

**Sync Log.** A developer/power-user accessible sync log records every Plaid API call result, webhook receipt, and processing outcome. This enables debugging of edge cases and provides a complete audit trail.

### 8.5 Privacy & Security

Plaid credentials are never stored by Cadence. The OAuth flow and credential-based Link flow both result in a Plaid access token, which is the only credential Cadence retains. Access tokens are stored encrypted at rest using AES-256, with the encryption key stored in environment variables separate from the database. The Plaid item ID and access token are associated with the user record and are never transmitted to the frontend; all Plaid API calls originate server-side.

Users are provided a clear data usage explanation before initiating the Plaid Link flow, explicitly stating: what data Cadence retrieves, that credentials are never stored, and how to disconnect accounts.

---

## 9. Design System & Mobile-Responsive UX {#design-and-ux}

### 9.1 Design Philosophy

Cadence's visual design should communicate precision, trustworthiness, and calm intelligence. The aesthetic goal is not Copilot's warmth (which reads as consumer-friendly and approachable) nor YNAB's utility-focused density — it is the visual language of a sophisticated instrument: dark or deep-neutral background, high information density with generous whitespace, precise typography, and restrained color use where each color carries semantic meaning (income, expense, credit, alert).

The closest reference aesthetic is the intersection of Bloomberg Terminal data density with modern design system cleanliness: dark mode by default with a light mode option, monospaced accents for numerical data, and sans-serif body type at multiple weight levels for hierarchy. The "Monolithic Observer" design pattern seen in several 2026 finance dashboard projects — dark obsidian backgrounds with electric accent colors — is a strong directional reference.

### 9.2 Color System

The color system is semantic and dual-purpose (dark/light mode):

- **Income / Positive:** Emerald green (e.g., `#10B981`) — used for income transactions, positive balance indicators, goal progress
- **Expense / Negative:** Coral red (e.g., `#F43F5E`) — used for expense transactions, overdraft risk, budget overages
- **Credit / Obligation:** Amber (e.g., `#F59E0B`) — used for credit card obligations, bill due dates, payment reminders
- **Neutral / Data:** Slate (e.g., `#94A3B8`) — used for historical data, comparative periods, secondary information
- **Primary Brand:** Electric indigo (e.g., `#6366F1`) — used for primary actions, selected states, AI-generated content markers
- **Background (dark):** Near-black with slight blue undertone (e.g., `#0F172A`)
- **Surface (dark):** Dark slate (e.g., `#1E293B`) — card backgrounds

### 9.3 Typography

- **Heading:** Inter (variable font) — clean, neutral, legible at all sizes
- **Body:** Inter — consistent with heading for visual harmony
- **Numerics / Financial Data:** JetBrains Mono or Geist Mono — monospaced numerics prevent layout shift as values update and signal precision to the user
- **Scale:** 4-level heading hierarchy with consistent line-height ratios; body at 16px minimum on mobile

### 9.4 Component Architecture

All components are built from shadcn/ui primitives to ensure accessibility (WCAG 2.1 AA compliance), keyboard navigability, and screen reader compatibility. The component library is structured in three tiers:

**Primitive components** (from shadcn/ui + Radix UI): Button, Input, Select, Dialog, Popover, Tooltip, Dropdown, Card, Badge, Switch, Tabs

**Domain components** (Cadence-specific): AccountCard, TransactionRow, CategoryBadge, BudgetMeter, CashFlowBar, RecurringChargeCard, BillCalendarEvent, AIMessageBubble, ConnectionHealthIndicator

**Page-level layouts**: DashboardLayout, CalendarLayout, TransactionListLayout, BudgetLayout, AssistantLayout

### 9.5 Responsive Breakpoints & Mobile Strategy

The application is built mobile-first with three breakpoints:

- **Mobile (< 640px):** Single-column layout; all primary actions reachable with one thumb; bottom navigation bar for primary sections (Dashboard, Transactions, Calendar, Budget, Assistant); FAB (floating action button) for receipt capture
- **Tablet (640px – 1024px):** Two-column layout; side panel for detail views; expanded chart sizes
- **Desktop (≥ 1024px):** Full three-column layout; persistent sidebar navigation; expanded data tables; side-by-side comparison views

**Mobile-specific features:**
- Receipt capture: camera API integration with direct upload from the mobile browser
- Swipe gestures on transaction rows (swipe left to categorize, swipe right to add note)
- Pull-to-refresh on account balance views
- Bottom sheet modals instead of centered dialogs for better thumb reach
- Offline-first transaction entry: manual transactions can be created without connectivity and sync when reconnected

### 9.6 Interaction Design & Animation

Animation is applied with deliberate restraint — its purpose is to communicate state change, not to entertain. Framer Motion handles:

- Page transition animations (slide-in for drill-down views, fade for peer-level transitions)
- Chart data entrance animations (bars/lines draw from left to right on first render)
- Alert and notification entrance (subtle slide-down from top)
- Number counting animations for balance updates (counters increment to new values over 400ms)

GSAP is reserved for the simulation engine (Phase 2+) where animated financial projections — lines drawing forward across a timeline — provide a kinesthetic sense of financial trajectory. All animations respect the user's `prefers-reduced-motion` setting.

---

## 10. Multi-Agent Partnership & GitHub Workflow {#multi-agent-plan}

### 10.1 Agent Roles & Responsibilities

The development of Cadence operates on a structured multi-agent model where each agent has a defined domain of accountability and a defined communication protocol for handing off work.

**WRITER Agent — Principal Strategist & Product Architect**
- Owns: Product vision, feature specifications, architecture decisions, research, market positioning, this proposal document, and all subsequent specification documents
- Produces: Feature specification documents (in `/docs/specs/`), architecture decision records (ADRs in `/docs/adr/`), research briefs, and implementation tickets
- Communicates: Via GitHub Issues (tagged `agent:writer`) and specification markdown files committed to the `docs/` directory
- Does not: Write application code or test suites

**Codex — Primary Build Agent**
- Owns: Full application implementation — frontend components, API routes, database schema, background jobs, and test suites
- Consumes: Feature spec documents and ADRs committed by WRITER Agent
- Produces: Implementation code in feature branches following the branch naming convention `feature/<spec-id>-<description>`
- Communicates: Via Pull Requests referencing the originating spec document, and via GitHub Issues for blockers (tagged `agent:codex`)

**QA Agent (ancillary) — Test & Validation Agent**
- Owns: End-to-end test suite creation and maintenance, regression testing after each Codex PR merge, accessibility audits
- Consumes: Codex PRs and WRITER spec documents
- Produces: Playwright test files in `e2e/`, Vitest integration tests in `src/__tests__/`, and test execution reports
- Communicates: Via PR review comments and GitHub Issues tagged `agent:qa`

**Data Agent (ancillary) — AI Tuning & Categorization Agent**
- Owns: AI prompt engineering, categorization taxonomy maintenance, few-shot example curation, and AI output quality evaluation
- Consumes: User-correction data (exported from production) and WRITER AI strategy specifications
- Produces: Updated prompt files in `src/ai/prompts/`, categorization taxonomy updates in `src/ai/taxonomy/`, and evaluation reports
- Communicates: Via GitHub PRs to the `ai/` directory

### 10.2 GitHub Repository Structure

```
cadence/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # lint, typecheck, unit test, build
│   │   ├── e2e.yml             # Playwright end-to-end tests
│   │   └── deploy.yml          # deploy to self-hosted server on main merge
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature-spec.md     # WRITER Agent creates feature specs here
│   │   ├── bug-report.md
│   │   └── architecture-adr.md
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── specs/                  # WRITER Agent: feature specifications
│   │   ├── SPEC-001-plaid-connection.md
│   │   ├── SPEC-002-cash-flow-calendar.md
│   │   └── ...
│   ├── adr/                    # Architecture Decision Records
│   │   ├── ADR-001-database-choice.md
│   │   ├── ADR-002-llm-abstraction.md
│   │   └── ...
│   └── research/               # Market research and competitive analysis
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   ├── components/             # React components (primitive / domain / page)
│   ├── lib/                    # Shared utilities, database client, auth
│   ├── ai/                     # AI service layer, prompts, taxonomy
│   │   ├── prompts/            # System prompts and few-shot templates
│   │   ├── taxonomy/           # Category definitions and hierarchies
│   │   └── service.ts          # AI service abstraction (LLM router)
│   ├── plaid/                  # Plaid integration module
│   │   ├── client.ts           # Plaid API client
│   │   ├── webhooks.ts         # Webhook handler
│   │   └── sync.ts             # Transaction sync logic
│   └── jobs/                   # Background jobs (cron, BullMQ workers)
├── e2e/                        # Playwright end-to-end tests
├── prisma/ or drizzle/         # Database schema
├── docker/                     # Docker Compose and service configurations
├── nginx/                      # Nginx configuration
└── scripts/                    # Deployment and utility scripts
├── CONTRIBUTING.md             # Agent contribution guidelines
├── README.md
└── .env.example                # All required environment variables documented
```

### 10.3 Branch Strategy & Merge Protocol

The repository follows a trunk-based development model with short-lived feature branches:

- **`main`** — Production-ready code. Protected branch; requires at least one passing CI run and one review (can be self-approved by WRITER Agent for spec-only changes, requires Codex confirmation for code changes). Auto-deploys to the self-hosted server via GitHub Actions on merge.
- **`develop`** — Integration branch. Feature branches merge here first; `develop` merges to `main` at release checkpoints.
- **`feature/<spec-id>-<description>`** — Codex implementation branches, scoped to a single feature spec (e.g., `feature/SPEC-001-plaid-connection`).
- **`fix/<issue-number>-<description>`** — Bug fix branches.
- **`docs/<description>`** — WRITER Agent spec and documentation branches (never touch `src/`).
- **`ai/<description>`** — Data Agent prompt and taxonomy branches (only touch `src/ai/`).

### 10.4 Specification Workflow (Agent Communication Protocol)

The canonical workflow for coordinating work across agents is as follows:

1. **WRITER Agent** identifies a feature to build, conducts necessary research, and creates a Feature Specification document in `docs/specs/SPEC-NNN-feature-name.md`. The spec includes: user story, acceptance criteria, data model implications, API contract (request/response shapes), UI wireframe description, error states, and test coverage requirements.

2. **WRITER Agent** creates a GitHub Issue using the `feature-spec` template, attaches the spec document path, and assigns it to Codex. The issue is tagged `agent:codex`, `type:feature`, and the relevant phase label (`phase:1`, `phase:2`, etc.).

3. **Codex** reads the spec, creates a feature branch, implements the feature, writes the required tests, and opens a Pull Request referencing the originating Issue. The PR description includes a spec compliance checklist confirming each acceptance criterion is met.

4. **QA Agent** reviews the PR for test coverage completeness, runs the E2E suite against a preview deployment, and approves or requests changes.

5. **WRITER Agent** reviews for spec compliance (do the implemented behaviors match what was specified?). Approves or requests corrections.

6. On approval, the PR merges to `develop`. WRITER Agent updates the spec document with an "Implemented" status marker.

7. At phase completion, `develop` merges to `main` and the GitHub Actions deploy workflow publishes to the self-hosted server.

### 10.5 Environment & Secrets Management

All secrets are managed via environment variables, never committed to the repository. The `.env.example` file documents all required variables without values. The production environment on the self-hosted server uses a secrets manager (HashiCorp Vault or Docker Secrets) to inject values at container startup. Required environment variables include:

```
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox|development|production
PLAID_WEBHOOK_URL=

# LLM (self-hosted or hosted)
LLM_BASE_URL=
LLM_API_KEY=
LLM_MODEL=

# Email (Nodemailer)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Redis (BullMQ)
REDIS_URL=

# File Storage
STORAGE_TYPE=local|cloudinary
CLOUDINARY_URL= (if applicable)

# App
APP_URL=
ENCRYPTION_KEY=
```

### 10.6 Deployment Architecture (Self-Hosted Server)

The self-hosted server deployment uses Docker Compose to orchestrate all services:

```yaml
services:
  app:          # Next.js application
  postgres:     # PostgreSQL database
  redis:        # Redis for BullMQ job queues
  worker:       # BullMQ worker process (background jobs)
  nginx:        # Reverse proxy + TLS
  llm:          # LLM server (Ollama / vLLM / custom)
```

Nginx handles TLS termination using Let's Encrypt certificates (via Certbot) and routes traffic to the Next.js application. The LLM container is configured with the appropriate GPU passthrough (if available on the server) or CPU inference settings. All services communicate over a Docker internal network; only Nginx is exposed to the public internet on ports 80 and 443.

The CI/CD pipeline (`deploy.yml`) SSHs into the server on `main` branch merge, pulls the latest Docker images, and performs a rolling restart ensuring zero-downtime deployments for the web application and worker processes.

---

## 11. Monetisation Strategy {#monetisation}

### 11.1 Phase 1: Personal Use (Months 1–6)

During the initial personal-use phase, Cadence operates as a self-hosted application with no monetisation infrastructure. This is the correct starting position: the AI server is already available, hosting costs are absorbed, and the absence of users removes GDPR/data compliance requirements from the critical path. This phase should be treated as an extended private beta during which the core feature set is validated against real personal financial data. No commercial infrastructure should be built before the product has demonstrated sufficient value to justify it.

### 11.2 Phase 2: Early Access / Waitlist (Months 7–12)

If the application demonstrates sufficient personal value to warrant a public launch, a lightweight commercial infrastructure is added:

**Pricing Model:** Subscription-based, monthly and annual options. Based on the competitive analysis, $8–10 per month ($79–99 per year) is the correct price point to position below YNAB and Monarch while signaling premium quality above Simplifi. Early access "founding member" pricing at $4.99/month (locked for life) creates urgency and rewards early adopters.

**Payment:** Stripe integration for subscription management, including trials, upgrades, downgrades, and cancellation. A 30-day free trial (no credit card required) follows YNAB's successful model of capturing trust before requesting payment commitment.

**Free Tier:** A limited free tier — maximum 2 connected accounts, 90 days of transaction history, no AI assistant — provides a genuine taste of the product's core value without undermining paid conversion.

**Pricing Transparency:** Full pricing is disclosed prominently before account creation, specifically avoiding the opacity that generated negative sentiment for YNAB at its price increase.

### 11.3 Phase 3: Scale (Year 2+)

**Team / Household Plans:** Shared access for 2–6 users at a 1.5x individual price (better value than multiple individual subscriptions).

**API Access Tier:** A developer tier at a premium price point for users who want programmatic access to their financial data via the personal API.

**Enterprise / White-Label:** If the product demonstrates market fit, a white-label option for financial advisory firms or HR platforms (employee financial wellness programs) provides a B2B revenue stream substantially larger per account than the consumer subscription.

**Value-Add AI Features:** Select AI features (scenario simulation, coached onboarding, annual financial review generation) may be gated to higher tiers if they carry significant LLM inference cost. However, during the personal use and early access phases, all features should be included in a single tier to simplify the value proposition.

---

## 12. Open Questions & Next Steps {#next-steps}

### 12.1 Information Required from Jeffrey

The following items are needed before Codex can begin implementation:

1. **Server Specifications.** Processor architecture, RAM, GPU availability, operating system version, and existing Docker configuration on the custom AI server. This determines the LLM model selection (quantization level, context length, and inference speed), container resource allocation in the Docker Compose file, and whether GPU passthrough is viable for LLM inference.

2. **LLM Model(s) Available.** Which models are currently hosted on the custom AI server? API endpoint format (OpenAI-compatible `/v1/chat/completions`? Custom format?). Authentication method (API key? Local-only? mTLS?). This determines the exact `LLM_BASE_URL`, `LLM_MODEL`, and prompt engineering choices in `src/ai/`.

3. **Plaid API Key & Environment.** The Plaid Client ID, Secret, and whether the current API key is Sandbox, Development, or Production. The initial integration will use the Sandbox environment for safe testing without live bank connections.

4. **Domain & TLS.** The intended domain name for Cadence (e.g., `cadence.yourdomain.com`). Nginx and Let's Encrypt configuration requires a real domain pointing to the server's public IP before TLS certificates can be provisioned.

5. **Email Configuration.** SMTP server credentials for notification delivery (bill reminders, weekly digests). If no SMTP server is available, the initial phase can use a service like Resend or SendGrid with a free tier.

6. **GitHub Repository.** The URL of the existing GitHub repository, its current structure (if any code is already present), and the preferred default branch name. Agent account access (GitHub token or SSH key) will be required for Codex and QA Agent commits.

7. **Pay Schedule Confirmation.** Confirmation that the semi-monthly schedule is 1st and 15th (or an alternate fixed pattern). This parameters the default pay schedule detection and the Cash Flow Calendar's paycheck event placement.

### 12.2 Recommended Immediate Next Steps

**Step 1 — Environment Setup Spec (WRITER Agent):** Upon receipt of server details, prepare `SPEC-000-environment-setup.md` — a complete environment configuration document covering Docker Compose, Nginx, environment variables, and LLM integration. This is the prerequisite for all subsequent implementation.

**Step 2 — Data Model Spec (WRITER Agent):** Prepare `SPEC-001-database-schema.md` — complete Drizzle ORM schema definitions for all seven core entities, including indexes, foreign keys, and seed data for sandbox testing.

**Step 3 — Plaid Connection Spec (WRITER Agent):** Prepare `SPEC-002-plaid-connection.md` — detailed specification for Plaid Link integration, webhook handler, and transaction sync. This is the highest-priority user-facing feature and should be the first Codex implementation task.

**Step 4 — Dashboard Spec (WRITER Agent):** Prepare `SPEC-003-dashboard.md` — complete component specification for the primary dashboard view, including the AccountCard component, balance display, and basic transaction list.

**Step 5 — Codex Kickoff:** With Specs 000–003 complete and environment configured, Codex begins implementation in parallel across the environment setup and database schema branches.

### 12.3 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Plaid connection instability | High | Medium | Implement connection health monitoring, fallback CSV import, and proactive re-auth prompting from day one |
| LLM hallucination on financial figures | Medium | High | Implement output validation against database; flag unverifiable numerical claims; never present AI outputs as authoritative without database confirmation |
| Privacy/security of financial credentials | Low (with correct architecture) | Critical | Server-side-only Plaid calls; encrypted access token storage; no credential persistence; HTTPS enforced |
| Feature scope creep delaying Phase 1 | Medium | Medium | Strict adherence to Phase 1 feature list; WRITER Agent maintains scope discipline; all Phase 2+ features are explicitly blocked behind spec completion |
| Self-hosted LLM inference latency | Medium | Low | Async AI responses with streaming; background pre-computation of common insights; user expectation setting for complex analyses |
| Bank of America OAuth migration (2026) | Medium | Low | Monitor Plaid changelog; implement migration-ready OAuth flow from initial build |

---

## Appendix A: Competitive Feature Matrix

| Feature | Cadence (proposed) | YNAB | Monarch | Copilot | Simplifi |
|---|---|---|---|---|---|
| Web app | ✅ | ✅ | ✅ | ✅ (Dec 2025) | ✅ |
| iOS app | ✅ (PWA) | ✅ | ✅ | ✅ | ✅ |
| Android app | ✅ (PWA) | ✅ | ✅ | ❌ | ✅ |
| Plaid integration | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manual / CSV import | ✅ (first-class) | Limited | Limited | Limited | Limited |
| Cash flow calendar | ✅ | ❌ | Partial | ❌ | Partial |
| Semi-monthly paycheck optimization | ✅ | ❌ | ❌ | ❌ | ❌ |
| Credit card clarity view | ✅ | Complex | ✅ | ✅ | ✅ |
| Subscription detection | ✅ | ❌ | Partial | ✅ | Partial |
| AI financial assistant | ✅ (conversational) | ❌ | ✅ (limited) | Partial | ❌ |
| Self-hosted LLM | ✅ | ❌ | ❌ | ❌ | ❌ |
| Privacy-first mode | ✅ | ❌ | ❌ | ❌ | ❌ |
| Scenario simulation | ✅ (Phase 2) | ❌ | ✅ | ❌ | ❌ |
| Net worth tracking | ✅ (Phase 2) | ❌ | ✅ | Partial | ✅ |
| Investment tracking | ✅ (Phase 2) | ❌ | ✅ | Partial | ❌ |
| Debt payoff planner | ✅ (Phase 2) | ✅ | ✅ | ❌ | ❌ |
| Receipt capture (mobile) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Self-hosted deployment | ✅ | ❌ | ❌ | ❌ | ❌ |
| Open-source (optional) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Price (annual) | $79–99/yr | $109/yr | $99.99/yr | $95/yr | $72/yr |

---

## Appendix B: Tech Stack Summary

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server-side rendering, secure API routes, RSC for performance |
| Language | TypeScript 5 | Type safety across all financial data flows |
| UI Components | shadcn/ui + Radix UI | Accessible, composable, no opaque dependency |
| Styling | Tailwind CSS v4 | Performance, utility-first, design token support |
| Animation | Framer Motion + GSAP | Layered: transitions vs. simulation sequences |
| Charts | Recharts | React-native, composable, well-maintained |
| Tables | TanStack Table v8 | Headless, performant, virtualized |
| Database | PostgreSQL (Neon → self-hosted) | ACID compliance for financial data |
| ORM | Drizzle ORM | Type-safe, SQL-first, lightweight |
| Auth | NextAuth v5 (Auth.js) | Flexible, session + JWT support |
| AI Abstraction | Vercel AI SDK + custom router | Provider-agnostic, streaming support |
| LLM | Self-hosted (OpenAI-compatible) | Privacy, cost control, data sovereignty |
| Job Queue | BullMQ + Redis | Reliable async processing, webhook handling |
| Scheduler | node-cron | Lightweight in-process scheduling |
| Validation | Zod v4 | Runtime type safety, API contract enforcement |
| Testing | Vitest + Playwright | Unit, integration, and E2E coverage |
| CI/CD | GitHub Actions | Automated lint, test, build, deploy |
| Deployment | Docker Compose + Nginx | Self-hosted, reproducible, zero-vendor-lock |
| Email | Nodemailer + React Email | Self-hosted email delivery |
| File Storage | Multer + local/Cloudinary | Receipt upload and storage |
| Bank Data | Plaid (Transactions, Balance, Liabilities, Investments) | Industry standard, Multi-Item Link, OAuth |

---

*Document prepared by WRITER Agent for Jeffrey Geronimo. All research citations are inline and traceable to primary sources. This document is the authoritative product specification for Cadence and should be committed to the `/docs/` directory of the project GitHub repository as the initial reference artifact for all implementing agents.*

*Version history: v1.0 — Initial proposal, June 9, 2026*
