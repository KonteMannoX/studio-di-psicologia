import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(sessionCookie, "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
