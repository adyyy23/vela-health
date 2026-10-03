import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  createAppointment,
  getAppointmentsForUser,
  getAppointmentById,
  updateAppointmentStatus,
} from "@/lib/data";
import { getDb } from "@/lib/db";
export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(
    { appointments: getAppointmentsForUser(user.id, user.role) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { error: "Please sign in to book." },
      { status: 401 },
    );
  if (user.role !== "PATIENT")
    return NextResponse.json(
      { error: "Patient access required." },
      { status: 403 },
    );
  try {
    const body = await request.json();
    const required = [
      "doctorId",
      "clinicId",
      "scheduledDate",
      "scheduledTime",
      "consultationType",
      "reason",
    ];
    if (
      required.some((k) => typeof body[k] !== "string" || !body[k].trim()) ||
      body.reason.length > 2000
    )
      return NextResponse.json(
        { error: "Complete all required booking fields." },
        { status: 400 },
      );
    const result = getDb()
      .transaction(() => {
        const previous = body.rescheduleId
          ? getAppointmentById(body.rescheduleId)
          : null;
        if (
          body.rescheduleId &&
          (!previous ||
            previous.patientId !== user.id ||
            !["CONFIRMED", "UPCOMING", "REQUESTED", "RESCHEDULED"].includes(
              previous.status,
            ))
        )
          return {
            success: false,
            error: "This appointment cannot be rescheduled.",
          };
        const created = createAppointment({ ...body, patientId: user.id });
        if (created.success && previous)
          updateAppointmentStatus(
            previous.id,
            "CANCELLED",
            user.id,
            `Rescheduled to ${created.appointmentId}`,
          );
        return created;
      })
      .immediate();
    if (!result.success) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(
      {
        ...result,
        referenceNo: getAppointmentById(result.appointmentId!)?.referenceNo,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to book. Please retry or choose another time." },
      { status: 500 },
    );
  }
}
