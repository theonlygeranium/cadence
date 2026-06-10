# SPEC-002: Plaid Link Integration & Transaction Sync

**Version:** 1.0  
**Status:** Ready for Implementation  
**Author:** WRITER Agent  
**Assignee:** Codex  
**Depends on:** SPEC-001 (database schema must be complete)  
**Date:** 2026-06-09

---

## Objective

Implement the complete Plaid integration: Link token creation, public token exchange, account sync, and incremental transaction sync via the Plaid Transactions Sync API.

---

## Pre-Build Checklist

- [ ] SPEC-001 is complete: all database tables exist
- [ ] `.env.local` contains `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV=sandbox`
- [ ] The Plaid Node.js SDK is installed: `npm install plaid`
- [ ] User is authenticated (auth session available via `auth()`)

---

## Plaid Credentials (Sandbox)

| Variable | Value |
|----------|-------|
| `PLAID_CLIENT_ID` | `6a28c468cd6f99000ddddc6a` |
| `PLAID_ENV` | `sandbox` (upgrade to `production` when Jeffrey confirms) |
| `PLAID_SECRET` | Use sandbox secret from `.env.local` — never commit |

---

## Implementation

### 1. Plaid Client — `src/lib/plaid/client.ts`

```typescript
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { env } from "@/lib/env";

const config = new Configuration({
  basePath: PlaidEnvironments[env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(config);
```

### 2. API Routes

#### POST `/api/plaid/link-token`

Creates a Plaid Link token for the authenticated user.

- Requires: authenticated session
- Calls: `plaidClient.linkTokenCreate()`
- Products: `["transactions"]`
- Returns: `{ link_token: string }`

#### POST `/api/plaid/exchange-token`

Exchanges a Plaid public token for an access token after Link completes.

- Requires: authenticated session, `{ public_token: string }` body
- Calls: `plaidClient.itemPublicTokenExchange()`
- Encrypts the access token and stores it in `plaid_items`
- Immediately triggers an initial account + transaction sync
- Returns: `{ success: true, itemId: string }`

#### DELETE `/api/plaid/item/[itemId]`

Removes a linked institution.

- Requires: authenticated session, ownership assertion
- Calls: `plaidClient.itemRemove()`
- Deletes from `plaid_items` (cascades to accounts and transactions)
- Returns: `{ success: true }`

### 3. Transaction Sync — `src/lib/plaid/sync.ts`

Implement `syncTransactions(userId: string, plaidItemId: string)` using the Plaid `/transactions/sync` endpoint:

```typescript
export async function syncTransactions(userId: string, plaidItemId: string): Promise<SyncResult>
```

This function must:

1. Retrieve the `plaid_item` record for `plaidItemId` (assert ownership by `userId`)
2. Decrypt the access token
3. Call `plaidClient.transactionsSync()` with the stored `cursor` (or `undefined` for initial sync)
4. Page through all results until `has_more` is `false`
5. Upsert `added` transactions to the `transactions` table
6. Mark `modified` transactions as updated
7. Delete `removed` transactions by `plaid_transaction_id`
8. Update `plaid_items.cursor` with the new cursor value
9. Upsert `plaid_accounts` with fresh balance data from `accounts` in the sync response
10. Return `{ added: number, modified: number, removed: number }`

#### Error Handling

- `ITEM_LOGIN_REQUIRED`: set `plaid_items.status = "login_required"`, do not throw — return gracefully so the client can prompt re-auth
- Rate limits (429): implement exponential backoff with 3 retries
- All other Plaid errors: log sanitized error code (never log access token), rethrow

### 4. Sync API Route — POST `/api/plaid/sync`

Triggers a transaction sync for all of the authenticated user's active Plaid items.

- Iterates all `plaid_items` where `userId = session.user.id` and `status = "active"`
- Calls `syncTransactions()` for each
- Returns aggregate result

### 5. Account Summary — `src/lib/plaid/accounts.ts`

Implement `getAccountSummary(userId: string)` which returns:

```typescript
{
  totalBalance: number;
  creditCardBalance: number;
  checkingBalance: number;
  savingsBalance: number;
  accounts: PlaidAccount[];
}
```

---

## Acceptance Criteria

- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] Plaid Link opens in the browser when `/api/plaid/link-token` is called
- [ ] After completing Plaid Link with sandbox credentials, the item is stored in `plaid_items`
- [ ] Transactions appear in the `transactions` table after sync
- [ ] Access tokens are encrypted in the database (not plain text)
- [ ] `syncTransactions()` handles `ITEM_LOGIN_REQUIRED` without throwing
- [ ] All API routes assert user ownership before accessing any Plaid item
- [ ] `CHANGELOG.md` updated
- [ ] `docs/PROJECT_CONTINUITY.md` updated

---

## Security Notes

- Never return `access_token` from any API route response.
- All routes must use `auth()` from NextAuth.js and return 401 if session is absent.
- Log Plaid error codes only — never log request bodies containing access tokens.
- The Plaid sandbox environment uses test credentials that never touch real bank accounts.