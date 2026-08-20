import { NextResponse } from "next/server";
import { configuredEmail, createSession, passwordMatches, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (email !== configuredEmail().toLowerCase() || !(await passwordMatches(password))) {
    return NextResponse.json({ error: "Credenziali non valide." }, { status: 401 });
  }

  const response = NextResponse.json({ email });
  response.cookies.set(sessionCookie, createSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
