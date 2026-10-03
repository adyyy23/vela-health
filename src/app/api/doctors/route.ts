import { NextResponse } from "next/server";
import { getDoctors, getAllSpecialties } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialtyId = searchParams.get("specialtyId") || undefined;
    const clinicId = searchParams.get("clinicId") || undefined;
    const consultationType = searchParams.get("consultationType") as any;
    const search = searchParams.get("search") || undefined;

    const doctors = getDoctors({
      specialtyId,
      clinicId,
      consultationType,
      search,
    });
    return NextResponse.json({ doctors, specialties: getAllSpecialties() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
