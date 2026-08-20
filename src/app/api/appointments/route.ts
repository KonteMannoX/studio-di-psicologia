import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toViewModel(appointment: { id: string; startsAt: Date; type: string; status: string; patient: { firstName: string; lastName: string } }) {
  const hours = appointment.startsAt.toISOString().slice(11, 16);
  return {
    id: appointment.id,
    day: String(appointment.startsAt.getUTCDate()).padStart(2, "0"),
    time: hours,
    name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    type: appointment.type,
    color: "amber",
    status: appointment.status,
  };
}

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    include: { patient: true },
    orderBy: { startsAt: "asc" },
  });
  return NextResponse.json(appointments.map(toViewModel));
}

export async function POST(request: Request) {
  const body = await request.json();
  const patientName = typeof body.patient === "string" ? body.patient.trim() : "";
  const day = typeof body.day === "string" ? body.day : "";
  const time = typeof body.time === "string" ? body.time : "";
  const patient = await prisma.patient.findFirst({
    where: { OR: [{ firstName: patientName.split(" ")[0], lastName: patientName.split(" ").slice(1).join(" ") }] },
  });

  if (!patient || !day || !time) {
    return NextResponse.json({ error: "Paziente, giorno e orario sono obbligatori." }, { status: 400 });
  }

  const startsAt = new Date(`2025-06-${day.padStart(2, "0")}T${time}:00.000Z`);
  const overlappingAppointment = await prisma.appointment.findFirst({ where: { startsAt } });
  if (overlappingAppointment && body.allowOverlap !== true) {
    return NextResponse.json({ error: "Esiste gia un appuntamento a questo orario." }, { status: 409 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      startsAt,
      type: typeof body.type === "string" ? body.type : "Colloquio individuale",
      patientId: patient.id,
    },
    include: { patient: true },
  });

  return NextResponse.json(toViewModel(appointment), { status: 201 });
}
