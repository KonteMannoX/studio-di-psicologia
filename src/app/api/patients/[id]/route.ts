import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Nome e cognome sono obbligatori." }, { status: 400 });
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      firstName,
      lastName,
      phone: typeof body.phone === "string" ? body.phone.trim() || null : null,
      email: typeof body.email === "string" ? body.email.trim() || null : null,
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
