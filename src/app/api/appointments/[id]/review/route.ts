import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { submitReview } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { doctorRating, clinicRating, comment } = body;

    if (
      !Number.isInteger(doctorRating) ||
      !Number.isInteger(clinicRating) ||
      doctorRating < 1 ||
      doctorRating > 5 ||
      clinicRating < 1 ||
      clinicRating > 5 ||
      (comment !== undefined &&
        (typeof comment !== "string" || comment.length > 2000))
    ) {
      return NextResponse.json(
        { error: "Ratings are required." },
        { status: 400 },
      );
    }

    const result = await getDb()
      .transaction(() =>
        submitReview({
          appointmentId: id,
          patientId: user.id,
          doctorRating: Number(doctorRating),
          clinicRating: Number(clinicRating),
          comment,
        }),
      )
      .immediate();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Review could not be saved. Please try again." },
      { status: 500 },
    );
  }
}
