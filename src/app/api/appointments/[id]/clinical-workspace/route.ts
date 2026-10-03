import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { saveClinicalConsultation } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized. Doctor access required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { clinicalNotes, prescription, followUpInstructions, markCompleted } = body;

    if (!clinicalNotes) {
      return NextResponse.json({ error: "Clinical notes are required." }, { status: 400 });
    }

    const ok = saveClinicalConsultation(id, user.id, {
      clinicalNotes,
      prescription,
      followUpInstructions,
      markCompleted: Boolean(markCompleted),
    });

    if (!ok) {
      return NextResponse.json({ error: "Failed to update clinical consultation." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
