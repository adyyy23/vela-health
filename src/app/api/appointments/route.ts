import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createAppointment, getAppointmentsForUser } from "@/lib/data";
import { getAppointmentsFromSupabase, createAppointmentInSupabase } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      const supaApts = await getAppointmentsFromSupabase(user.id, user.role);
      if (supaApts) {
        return NextResponse.json({ appointments: supaApts });
      }
    }

    const appointments = getAppointmentsForUser(user.id, user.role);
    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to book an appointment." }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, clinicId, serviceId, scheduledDate, scheduledTime, consultationType, reason } = body;

    if (!doctorId || !clinicId || !scheduledDate || !scheduledTime || !consultationType || !reason) {
      return NextResponse.json({ error: "All booking fields are required." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supaResult = await createAppointmentInSupabase({
        patientId: user.id,
        doctorId,
        clinicId,
        serviceId,
        scheduledDate,
        scheduledTime,
        consultationType,
        reason,
      });
      if (supaResult.success) {
        return NextResponse.json(supaResult);
      }
    }

    const result = createAppointment({
      patientId: user.id,
      doctorId,
      clinicId,
      serviceId,
      scheduledDate,
      scheduledTime,
      consultationType,
      reason,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, appointmentId: result.appointmentId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
