import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { submitReview } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { doctorRating, clinicRating, comment } = body;

    if (!doctorRating || !clinicRating) {
      return NextResponse.json({ error: "Ratings are required." }, { status: 400 });
    }

    const result = submitReview({
      appointmentId: id,
      patientId: user.id,
      doctorRating: Number(doctorRating),
      clinicRating: Number(clinicRating),
      comment,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
