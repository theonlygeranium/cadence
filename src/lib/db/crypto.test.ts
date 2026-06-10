import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function stubRequiredEnv() {
  vi.stubEnv("DATABASE_URL", "postgresql://cadence:test@localhost:5432/cadence");
  vi.stubEnv("ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef");
  vi.stubEnv("NEXTAUTH_SECRET", "ci_placeholder_secret_min_32_chars_xx");
  vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000");
  vi.stubEnv("PLAID_CLIENT_ID", "placeholder_client");
  vi.stubEnv("PLAID_SECRET", "placeholder_secret");
  vi.stubEnv("PLAID_ENV", "sandbox");
  vi.stubEnv("OLLAMA_BASE_URL", "http://127.0.0.1:11434");
  vi.stubEnv("OLLAMA_MODEL", "qwen3.6:latest");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
}

describe("database secret crypto", () => {
  beforeEach(() => {
    vi.resetModules();
    stubRequiredEnv();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("encrypts and decrypts Plaid access tokens without preserving plaintext", async () => {
    const { decryptSecret, encryptSecret, encryptedSecretMatches } = await import(
      "./crypto"
    );
    const plaintext = "access-sandbox-token";

    const encrypted = encryptSecret(plaintext);

    expect(encrypted).not.toContain(plaintext);
    expect(decryptSecret(encrypted)).toBe(plaintext);
    expect(encryptedSecretMatches(encrypted, plaintext)).toBe(true);
  });

  it("rejects tampered ciphertext", async () => {
    const { decryptSecret, encryptSecret } = await import("./crypto");
    const encrypted = encryptSecret("access-sandbox-token");
    const [version, iv, , ciphertext] = encrypted.split(":");
    const tampered = [
      version,
      iv,
      Buffer.alloc(16).toString("base64url"),
      ciphertext,
    ].join(":");

    expect(() => decryptSecret(tampered)).toThrow();
  });
});
