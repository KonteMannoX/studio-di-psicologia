import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, sessionCookie } from "@/lib/auth";

export async function GET() {
  const session = readSession((await cookies()).get(sessionCookie)?.value);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, email: session.email });
}
