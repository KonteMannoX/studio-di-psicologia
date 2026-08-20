import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

export const sessionCookie = "studio-calma-session";
const sessionDuration = 60 * 60 * 8;

function secret() {
  return process.env.AUTH_SECRET ?? "local-only-change-this-secret";
}

export async function passwordMatches(password: string) {
  const storedHash = process.env.STUDIO_PASSWORD_HASH;
  if (storedHash) return bcrypt.compare(password, storedHash);
  return password === (process.env.STUDIO_PASSWORD ?? "demo-password-change-me");
}

export function configuredEmail() {
  return process.env.STUDIO_LOGIN_EMAIL ?? "martina@studio.local";
}

export function createSession(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDuration;
  const payload = `${email}|${expiresAt}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}|${signature}`;
}

export function readSession(value?: string) {
  if (!value) return null;
  const [email, expiry, signature] = value.split("|");
  if (!email || !expiry || !signature || Number(expiry) < Math.floor(Date.now() / 1000)) return null;
  const payload = `${email}|${expiry}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return { email };
}
