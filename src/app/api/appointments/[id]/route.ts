import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getAppointmentById, updateAppointmentStatus } from "@/lib/data";
import { canAccessAppointment, canChangeStatus } from "@/lib/permissions";
import { getDb } from "@/lib/db";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const appointment = await getAppointmentById(id);
  if (!appointment || !canAccessAppointment(user, appointment))
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 },
    );
  return NextResponse.json(
    { appointment },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { status, note } = body;
  const result = await getDb()
    .transaction(async () => {
      const a = await getAppointmentById(id);
      if (!a || !canAccessAppointment(user, a)) return 404;
      if (typeof note !== "undefined" && typeof note !== "string") return 400;
      if (!canChangeStatus(user, a, status)) return 403;
      return (await updateAppointmentStatus(a.id, status, user.id, note))
        ? 200
        : 400;
    })
    .immediate();
  return NextResponse.json(
    result === 200
      ? { success: true, status }
      : {
          error:
            result === 404
              ? "Appointment not found"
              : "This status change is not permitted.",
        },
    { status: result },
  );
}
