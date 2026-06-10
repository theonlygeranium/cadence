# Plaid Live QA Runbook

This runbook closes the remaining SPEC-002 acceptance criteria once a fresh Plaid sandbox secret is available.

## Safety Rules

- Do not use the original Phase 0 sandbox secret. It was committed historically and must be treated as exposed.
- Do not paste Plaid secrets into repo files, docs, issue comments, commit messages, terminal output, screenshots, or memory.
- Store the rotated sandbox secret only in private runtime env files such as `/opt/cadence/.env.local`.
- Clear the local clipboard after copying a secret.
- Log only Plaid error codes and request IDs. Never log access tokens, public tokens, or full request bodies.

## Preconditions

1. Product owner explicitly approves rotating the Plaid sandbox secret.
2. Cadence is deployed on Schubert from `/opt/cadence`.
3. Schubert containers are healthy:

   ```bash
   cd /opt/cadence
   docker compose ps
   ```

4. Public route is available:

   ```bash
   curl -I https://cadence.jgeronimo.com/
   ```

## Rotate Sandbox Secret

1. Open the Plaid dashboard in the Work Chrome profile.
2. Go to **Developers > Keys**.
3. Rotate only the **Sandbox secret**.
4. Copy the new sandbox secret.
5. Confirm it differs from the exposed Phase 0 value without printing either value.

## Update Schubert Runtime Env

On Schubert, update only the private runtime env file:

```bash
cd /opt/cadence
chmod 600 .env .env.local
# Edit .env.local privately:
# PLAID_CLIENT_ID=<current client id>
# PLAID_SECRET=<rotated sandbox secret>
# PLAID_ENV=sandbox
docker compose up -d --build app
```

Do not write Plaid secrets to `.env.example` or any tracked file.

## Seed QA Session

Cadence does not yet have a user-facing auth provider. For live QA only, create an Auth.js database session directly in PostgreSQL, then use that session cookie in a browser automation context.

Required properties:

- User ID: dedicated QA-only UUID or stable `qa-user` ID.
- Email: non-real test address such as `qa@example.test`.
- Session token: generated random value, not committed or printed.
- Expiry: short-lived, preferably same-day.

After QA, delete the QA session and any nonessential QA user rows.

## Browser Link QA

1. Open `https://cadence.jgeronimo.com/` in a browser context with the QA session cookie.
2. Click **Connect bank**.
3. Verify Link token creation succeeds and the button becomes **Open Link**.
4. Open Plaid Link and complete sandbox institution linking with Plaid sandbox test credentials.
5. Confirm the exchange route completes without exposing tokens.

## Database Verification

Verify the resulting database state on Schubert:

- `plaid_items` contains an active item for the QA user.
- `plaid_items.access_token` uses the encrypted `v1:` format and is not a plain Plaid access token.
- `plaid_accounts` contains at least one account for the QA user.
- `transactions` contains synced sandbox transactions for the QA user.
- Required indexes from SPEC-001 are still present.

Use aggregate queries or redacted row samples only. Do not print access tokens.

## API Regression Checks

Run these after Link completion:

```bash
curl -i -X POST https://cadence.jgeronimo.com/api/chat \
  -H 'content-type: application/json' \
  --data '{"messages":[{"role":"user","content":"What are my account balances?"}]}'
```

Expected result without a session: typed `401` JSON response.

With the QA session cookie:

- Balance question triggers `get_account_balances`.
- Response figures match `plaid_accounts`.
- General question such as "What is a credit score?" does not execute tools.

## Cleanup

1. Delete short-lived QA session rows.
2. Clear local clipboard.
3. Remove temporary SSH keys or local secret scratch files.
4. Run:

   ```bash
   scripts/secret-scan.sh all
   git status --short --branch
   ```

5. Update `CHANGELOG.md` and `docs/PROJECT_CONTINUITY.md` with the live QA evidence.
