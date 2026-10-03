import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { joinWaitlist, getWaitlistForPatient } from "@/lib/data";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { doctorId, preferredStartDate, preferredEndDate, preferredTimeRange, notes } = await request.json();

    if (!doctorId || !preferredStartDate || !preferredEndDate || !preferredTimeRange) {
      return NextResponse.json({ error: "All waitlist preference fields are required." }, { status: 400 });
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
