import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAvailableSlots } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { recordActivity } from "@/lib/activity";
import { validDate, validTime } from "@/lib/care-time";
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  if (q.get("schedule") === "true") {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "DOCTOR")
      return NextResponse.json(
        { error: "Doctor access required" },
        { status: 403 },
      );
    return NextResponse.json(
      {
        blocks: getDb()
          .prepare(
            "SELECT * FROM doctor_availabilities WHERE doctor_id=? ORDER BY day_of_week,start_time,is_telehealth",
          )
          .all(user.id),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }
  const id = q.get("doctorId");
  const date = q.get("date");
  const type = q.get("type") || "IN_PERSON";
  if (!id || !validDate(date) || !["IN_PERSON", "TELEHEALTH"].includes(type))
    return NextResponse.json(
      { error: "Choose a valid physician, date and visit format." },
      { status: 400 },
    );
  return NextResponse.json(
    { slots: getAvailableSlots(id, date, type as "IN_PERSON" | "TELEHEALTH") },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "DOCTOR")
    return NextResponse.json(
      { error: "Doctor access required" },
      { status: 403 },
    );
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.inPersonEnabled !== "boolean" ||
    typeof body.telehealthEnabled !== "boolean"
  )
    return NextResponse.json(
      { error: "Select valid visit formats." },
      { status: 400 },
    );
  // Accept the older day-based form as well as independently editable windows.
  const blocks = Array.isArray(body.blocks)
    ? body.blocks
    : Array.isArray(body.days) && body.days.length === 7
      ? body.days.flatMap((d: any, i: number) =>
          d?.active
            ? [0, 1]
                .filter((t) =>
                  t ? body.telehealthEnabled : body.inPersonEnabled,
                )
                .map((t) => ({
                  day_of_week: (i + 1) % 7,
                  start_time: d.start,
                  end_time: d.end,
                  slot_duration_minutes: Number(body.slotDuration),
                  is_telehealth: t,
                }))
            : [],
        )
      : null;
  if (
    !blocks ||
    blocks.length > 84 ||
    blocks.some(
      (b: any) =>
        !b ||
        !Number.isInteger(b.day_of_week) ||
        b.day_of_week < 0 ||
        b.day_of_week > 6 ||
        !validTime(b.start_time) ||
        !validTime(b.end_time) ||
        b.start_time >= b.end_time ||
        ![20, 30, 45, 60].includes(b.slot_duration_minutes) ||
        ![0, 1].includes(b.is_telehealth),
    )
  )
    return NextResponse.json(
      { error: "Select valid hours and a visit length for every window." },
      { status: 400 },
    );
  for (let i = 0; i < blocks.length; i++)
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i],
        b = blocks[j];
      if (
        a.day_of_week === b.day_of_week &&
        a.is_telehealth === b.is_telehealth &&
        a.start_time < b.end_time &&
        b.start_time < a.end_time
      )
        return NextResponse.json(
          {
            error:
              "Time windows for the same day and visit format must not overlap.",
          },
          { status: 400 },
        );
    }
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM doctor_availabilities WHERE doctor_id=?").run(
      user.id,
    );
    for (const b of blocks)
      db.prepare(
        "INSERT INTO doctor_availabilities(id,doctor_id,day_of_week,start_time,end_time,slot_duration_minutes,is_telehealth) VALUES(?,?,?,?,?,?,?)",
      ).run(
        randomUUID(),
        user.id,
        b.day_of_week,
        b.start_time,
        b.end_time,
        b.slot_duration_minutes,
        b.is_telehealth,
      );
    db.prepare(
      "UPDATE doctor_profiles SET in_person_available=?,telehealth_available=? WHERE user_id=?",
    ).run(
      body.inPersonEnabled ? 1 : 0,
      body.telehealthEnabled ? 1 : 0,
      user.id,
    );
    recordActivity(user, "AVAILABILITY_UPDATED", `DOCTOR:${user.id}`);
  }).immediate();
  return NextResponse.json({ success: true });
}
