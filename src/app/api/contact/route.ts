import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const message = (body.message ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();

  if (!name || !phone || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, phone and message are required" },
      { status: 422 }
    );
  }

  try {
    await db.contactSubmission.create({
      data: { name, phone, email: email || null, subject: subject || null, message },
    });
  } catch (error) {
    console.error("[contact] db save failed", error);
  }

  console.log("[contact] new enquiry", {
    name,
    phone,
    email,
    subject,
    message,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, message: "Message received" });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "contact" });
}
