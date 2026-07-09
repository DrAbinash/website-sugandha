import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getSiteSettings,
  saveSiteSettings,
  resetSiteSettings,
} from "@/lib/site-settings";
import { siteConfig } from "@/config/site.config";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Not logged in" }, { status: 401 });
  }
  const settings = await getSiteSettings();
  return NextResponse.json({ ok: true, settings, defaults: siteConfig });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Not logged in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Settings must be an object" }, { status: 422 });
  }

  try {
    await saveSiteSettings(body as Record<string, unknown>);
  } catch (error) {
    console.error("[admin/settings] save failed", error);
    return NextResponse.json({ ok: false, error: "Could not save settings" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Not logged in" }, { status: 401 });
  }
  try {
    await resetSiteSettings();
  } catch (error) {
    console.error("[admin/settings] reset failed", error);
    return NextResponse.json({ ok: false, error: "Could not reset settings" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
