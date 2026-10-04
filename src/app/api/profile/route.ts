import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDoctorById } from "@/lib/data";
import { recordActivity } from "@/lib/activity";
export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(
    {
      user,
      profile:
        user.role === "DOCTOR"
          ? await getDoctorById(user.id)
          : await getDb()
              .prepare("SELECT * FROM patient_profiles WHERE user_id=?")
              .get(user.id),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await request.json();
    const db = getDb();
    if (user.role === "DOCTOR") {
      if (
        typeof b.bio !== "string" ||
        !b.bio.trim() ||
        b.bio.length > 5000 ||
        !Number.isFinite(Number(b.consultationFee)) ||
        Number(b.consultationFee) < 0 ||
        Number(b.consultationFee) > 10000
      )
        return NextResponse.json(
          { error: "Enter a biography and a fee from 0 to 10,000." },
          { status: 400 },
        );
      await db
        .prepare(
          "UPDATE doctor_profiles SET bio=?,consultation_fee=? WHERE user_id=?",
        )
        .run(b.bio.trim(), Number(b.consultationFee), user.id);
    } else if (user.role === "PATIENT") {
      if (
        ![
          "firstName",
          "lastName",
          "phone",
          "emergency_contact_name",
          "emergency_contact_phone",
          "address",
        ].every((k) => typeof b[k] === "string" && b[k].length <= 500) ||
        !b.firstName.trim() ||
        !b.lastName.trim()
      )
        return NextResponse.json(
          { error: "Complete your name and valid contact details." },
          { status: 400 },
        );
      await db
        .transaction(async () => {
          await db
            .prepare(
              "UPDATE users SET first_name=?,last_name=?,phone=? WHERE id=?",
            )
            .run(b.firstName.trim(), b.lastName.trim(), b.phone, user.id);
          await db
            .prepare(
              "UPDATE patient_profiles SET emergency_contact_name=?,emergency_contact_phone=?,address=? WHERE user_id=?",
            )
            .run(
              b.emergency_contact_name,
              b.emergency_contact_phone,
              b.address,
              user.id,
            );
        })
        .immediate();
    } else
      return NextResponse.json(
        { error: "Profile editing is not available for this role." },
        { status: 403 },
      );
    await recordActivity(user, "PROFILE_UPDATED", `USER:${user.id}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Profile could not be saved." },
      { status: 500 },
    );
  }
}
