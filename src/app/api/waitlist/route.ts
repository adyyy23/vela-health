import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { joinWaitlist, getWaitlistForPatient, getDoctorById } from "@/lib/data";

import { validDate, clinicDate } from "@/lib/care-time";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const waitlist = getWaitlistForPatient(user.id);
    return NextResponse.json({ waitlist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      doctorId,
      preferredStartDate,
      preferredEndDate,
      preferredTimeRange,
      notes,
    } = await request.json();

    if (
      typeof doctorId !== "string" ||
      !getDoctorById(doctorId)?.isActive ||
      !validDate(preferredStartDate) ||
      !validDate(preferredEndDate) ||
      preferredStartDate < clinicDate() ||
      preferredEndDate < preferredStartDate ||
      typeof preferredTimeRange !== "string" ||
      !preferredTimeRange ||
      preferredTimeRange.length > 100 ||
      (notes !== undefined &&
        (typeof notes !== "string" || notes.length > 2000))
    ) {
      return NextResponse.json(
        { error: "All waitlist preference fields are required." },
        { status: 400 },
      );
    }

    const result = joinWaitlist({
      patientId: user.id,
      doctorId,
      preferredStartDate,
      preferredEndDate,
      preferredTimeRange,
      notes,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
