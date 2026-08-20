import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const patientName = typeof body.patient === "string" ? body.patient.trim() : "";
  const parts = patientName.split(" ");
  const patient = await prisma.patient.findFirst({
    where: { firstName: parts[0], lastName: parts.slice(1).join(" ") },
  });
  const day = typeof body.day === "string" ? body.day : "";
  const time = typeof body.time === "string" ? body.time : "";

  if (!patient || !day || !time) {
    return NextResponse.json({ error: "Paziente, giorno e orario sono obbligatori." }, { status: 400 });
  }

  const startsAt = new Date(`2025-06-${day.padStart(2, "0")}T${time}:00.000Z`);
  const overlappingAppointment = await prisma.appointment.findFirst({ where: { startsAt, id: { not: id } } });
  if (overlappingAppointment && body.allowOverlap !== true) {
    return NextResponse.json({ error: "Esiste gia un appuntamento a questo orario." }, { status: 409 });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      startsAt,
      type: typeof body.type === "string" ? body.type : "Colloquio individuale",
      patientId: patient.id,
    },
    include: { patient: true },
  });

  return NextResponse.json({
    id: appointment.id,
    day: String(appointment.startsAt.getUTCDate()).padStart(2, "0"),
    time: appointment.startsAt.toISOString().slice(11, 16),
    name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    type: appointment.type,
    color: "amber",
    status: appointment.status,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await prisma.appointment.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
