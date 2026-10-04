import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { recordActivity } from "@/lib/activity";
import { saveClinicalConsultation } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Unauthorized. Doctor access required." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { clinicalNotes, prescription, followUpInstructions, markCompleted } =
      body;

    if (
      typeof markCompleted !== "boolean" ||
      (typeof prescription === "string" && prescription.length > 10000) ||
      (typeof followUpInstructions === "string" &&
        followUpInstructions.length > 10000) ||
      typeof clinicalNotes !== "string" ||
      !clinicalNotes.trim() ||
      clinicalNotes.length > 30000 ||
      (prescription && typeof prescription !== "string") ||
      (followUpInstructions && typeof followUpInstructions !== "string")
    ) {
      return NextResponse.json(
        { error: "Clinical notes are required." },
        { status: 400 },
      );
    }

    const ok = await getDb()
      .transaction(
        async () =>
          await saveClinicalConsultation(id, user.id, {
            clinicalNotes,
            prescription,
            followUpInstructions,
            markCompleted: Boolean(markCompleted),
          }),
      )
      .immediate();

    if (!ok) {
      return NextResponse.json(
        { error: "Failed to update clinical consultation." },
        { status: 400 },
      );
    }

    await recordActivity(
      user,
      markCompleted ? "VISIT_COMPLETED" : "CLINICAL_DRAFT_SAVED",
      `APPOINTMENT:${id}`,
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
