import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const type = (searchParams.get("type") || "IN_PERSON") as any;

    if (!doctorId || !date) {
      return NextResponse.json({ error: "doctorId and date are required." }, { status: 400 });
    }

    const slots = getAvailableSlots(doctorId, date, type);
    return NextResponse.json({ slots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
