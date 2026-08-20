import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail, normalizePersonName } from "@/lib/text";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const firstName = typeof body.firstName === "string" ? normalizePersonName(body.firstName) : "";
  const lastName = typeof body.lastName === "string" ? normalizePersonName(body.lastName) : "";

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Nome e cognome sono obbligatori." }, { status: 400 });
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      firstName,
      lastName,
      phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
      email: typeof body.email === "string" ? normalizeEmail(body.email) || null : null,
      emailConsent: body.emailConsent === true,
      whatsappConsent: body.whatsappConsent === true,
    },
  });

  return NextResponse.json(patient);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await prisma.patient.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
