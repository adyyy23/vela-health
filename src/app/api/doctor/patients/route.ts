import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "DOCTOR")
    return NextResponse.json(
      { error: "Clinician access required" },
      { status: 403 },
    );
  const patients = await getDb()
    .prepare(
      `SELECT u.id,u.first_name || ' ' || u.last_name AS name,u.email,u.phone,p.date_of_birth,p.blood_type,p.emergency_contact_name,p.emergency_contact_phone,COUNT(a.id) AS visits,MAX(a.scheduled_date) AS last_visit FROM users u JOIN appointments a ON a.patient_id=u.id LEFT JOIN patient_profiles p ON p.user_id=u.id WHERE a.doctor_id=? GROUP BY u.id,p.user_id ORDER BY name`,
    )
    .all(user.id);
  return NextResponse.json(
    { patients },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
