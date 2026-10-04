import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { performDigitalCheckIn } from "@/lib/data";

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
    const ok = await getDb()
      .transaction(async () => await performDigitalCheckIn(id, user.id))
      .immediate();

    if (!ok) {
      return NextResponse.json(
        {
          error:
            "Check-in opens 20 minutes before your visit and closes 30 minutes after its start. Confirm this is your active appointment.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "You're checked in! Please let your clinic reception know you have arrived.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
