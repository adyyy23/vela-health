import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  getAdminOverviewMetrics,
  getAuditLogs,
  getAllClinics,
  getDoctors,
  getAppointmentsForUser,
} from "@/lib/data";
import { recordActivity } from "@/lib/activity";
export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Administrator access required" },
      { status: 403 },
    );
  const db = getDb();
  const patients = db
    .prepare(
      `SELECT u.id,u.first_name || ' ' || u.last_name AS name,u.email,u.phone,u.created_at,COUNT(a.id) AS visits FROM users u LEFT JOIN appointments a ON a.patient_id=u.id WHERE u.role='PATIENT' GROUP BY u.id ORDER BY name`,
    )
    .all();
  const inactive = db
    .prepare("SELECT user_id FROM doctor_profiles WHERE is_active=0")
    .all() as { user_id: string }[];
  const { getDoctorById } = await import("@/lib/data");
  return NextResponse.json(
    {
      metrics: getAdminOverviewMetrics(),
      patients,
      logs: getAuditLogs(),
      clinics: getAllClinics(),
      doctors: [
        ...getDoctors(),
        ...inactive.map((d) => getDoctorById(d.user_id)).filter(Boolean),
      ],
      appointments: getAppointmentsForUser(user.id, "ADMIN"),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Administrator access required" },
      { status: 403 },
    );
  const b = await request.json().catch(() => null);
  if (!b || typeof b !== "object")
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const db = getDb();
  if (
    b.kind === "doctor" &&
    typeof b.isActive === "boolean" &&
    typeof b.id === "string"
  ) {
    const result = db
      .prepare("UPDATE doctor_profiles SET is_active=? WHERE user_id=?")
      .run(b.isActive ? 1 : 0, b.id);
    if (!result.changes)
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    recordActivity(
      user,
      b.isActive ? "DOCTOR_ACTIVATED" : "DOCTOR_SUSPENDED",
      `DOCTOR:${b.id}`,
    );
  } else if (
    b.kind === "clinic" &&
    typeof b.id === "string" &&
    ["name", "phone", "operatingHours"].every(
      (k) => typeof b[k] === "string" && b[k].trim() && b[k].length <= 500,
    )
  ) {
    const result = db
      .prepare("UPDATE clinics SET name=?,phone=?,operating_hours=? WHERE id=?")
      .run(b.name.trim(), b.phone.trim(), b.operatingHours.trim(), b.id);
    if (!result.changes)
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    recordActivity(user, "CLINIC_UPDATED", `CLINIC:${b.id}`);
  } else return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  return NextResponse.json({ success: true });
}
