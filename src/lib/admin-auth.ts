import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Very small cookie-session auth for the /admin panel.
 *
 * The password comes from the ADMIN_PASSWORD environment variable
 * (set in docker-compose.yml). If it is not set, a default is used and
 * the admin panel shows a warning telling the owner to set one.
 */

export const ADMIN_COOKIE = "care_admin_session";
const SESSION_DAYS = 7;

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "sugandha2026";
}

export function isDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || `care-admin-secret::${getAdminPassword()}`;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function checkPassword(password: string): boolean {
  return safeEqual(password, getAdminPassword());
}

/** Create the value stored in the session cookie: "<expiry>.<signature>" */
export function createSessionToken(): string {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && Date.now() < expires;
}

/** Check the current request's cookie. Use inside route handlers. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
