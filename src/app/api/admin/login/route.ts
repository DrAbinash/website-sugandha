import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
  isAdminAuthenticated,
  isDefaultPassword,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// Small in-memory brute-force brake: after repeated failures, force a wait.
let failedAttempts = 0;
let lockedUntil = 0;

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({
    ok: true,
    authenticated,
    usingDefaultPassword: isDefaultPassword(),
  });
}

export async function POST(request: Request) {
  if (Date.now() < lockedUntil) {
    const waitSeconds = Math.ceil((lockedUntil - Date.now()) / 1000);
    return NextResponse.json(
      { ok: false, error: `Too many wrong attempts. Please wait ${waitSeconds} seconds.` },
      { status: 429 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const password = (body.password ?? "").trim();
  if (!password || !checkPassword(password)) {
    failedAttempts += 1;
    if (failedAttempts >= 5) {
      lockedUntil = Date.now() + 60_000; // 1 minute lockout
      failedAttempts = 0;
    }
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  failedAttempts = 0;
  // Only mark the cookie "secure" when the site is actually served over
  // HTTPS, so logging in over the clinic LAN (plain http://192.168.x.x)
  // still works.
  const proto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
