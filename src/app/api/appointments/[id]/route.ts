import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getAppointmentById, updateAppointmentStatus } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apt = getAppointmentById(id);
    if (!apt) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    return NextResponse.json({ appointment: apt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
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
    const { status, note } = body;

    if (!status) {
      return NextResponse.json({ error: "New status is required" }, { status: 400 });
    }

    const ok = updateAppointmentStatus(id, status, user.id, note);
    if (!ok) {
      return NextResponse.json({ error: "Failed to update appointment status" }, { status: 400 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
