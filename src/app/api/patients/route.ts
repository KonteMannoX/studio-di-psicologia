import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePersonName } from "@/lib/text";

export async function GET() {
  const patients = await prisma.patient.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const firstName = typeof body.firstName === "string" ? normalizePersonName(body.firstName) : "";
  const lastName = typeof body.lastName === "string" ? normalizePersonName(body.lastName) : "";

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Nome e cognome sono obbligatori." },
      { status: 400 },
    );
  }

  const normalizedEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const normalizedPhone = typeof body.phone === "string" ? body.phone.trim() : "";
  const duplicate = await prisma.patient.findFirst({
    where: {
      OR: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        { firstName, lastName },
      ],
    },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Esiste gia un paziente con questi dati." }, { status: 409 });
  }

  const patient = await prisma.patient.create({
    data: {
      firstName,
      lastName,
      phone: normalizedPhone || null,
      email: normalizedEmail || null,
      emailConsent: body.emailConsent === true,
      whatsappConsent: body.whatsappConsent === true,
    },
  });

  return NextResponse.json(patient, { status: 201 });
}
