import { NextResponse } from "next/server";
import { getAllClinics } from "@/lib/data";

export async function GET() {
  try {
    const clinics = getAllClinics();
    return NextResponse.json({ clinics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
