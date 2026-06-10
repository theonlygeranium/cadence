import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const VERSION = "v1";

function keyFromEnv(): Buffer {
  return createHash("sha256").update(env.ENCRYPTION_KEY, "utf8").digest();
}

function encode(buffer: Buffer): string {
  return buffer.toString("base64url");
}

function decode(value: string): Buffer {
  return Buffer.from(value, "base64url");
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, keyFromEnv(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [VERSION, encode(iv), encode(tag), encode(ciphertext)].join(":");
}

export function decryptSecret(encrypted: string): string {
  const [version, ivValue, tagValue, ciphertextValue] = encrypted.split(":");

  if (version !== VERSION || !ivValue || !tagValue || !ciphertextValue) {
    throw new Error("Invalid encrypted secret format.");
  }

  const tag = decode(tagValue);
  if (tag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Invalid encrypted secret authentication tag.");
  }

  const decipher = createDecipheriv(ALGORITHM, keyFromEnv(), decode(ivValue), {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([
    decipher.update(decode(ciphertextValue)),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

export function encryptedSecretMatches(
  encrypted: string,
  candidatePlaintext: string
): boolean {
  const decrypted = Buffer.from(decryptSecret(encrypted));
  const candidate = Buffer.from(candidatePlaintext);

  return (
    decrypted.length === candidate.length && timingSafeEqual(decrypted, candidate)
  );
}
