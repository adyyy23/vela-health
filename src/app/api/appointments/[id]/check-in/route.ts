import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { performDigitalCheckIn } from "@/lib/data";

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
    const ok = performDigitalCheckIn(id, user.id);

    if (!ok) {
      return NextResponse.json({ error: "Check-in could not be completed. Please ensure this is your appointment." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "You're checked in! Please proceed to Reception Area B.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
