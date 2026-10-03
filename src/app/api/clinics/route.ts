import { NextResponse } from "next/server";
import { getAllClinics } from "@/lib/data";
import { getClinicsFromSupabase } from "@/lib/supabase-data";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supaClinics = await getClinicsFromSupabase();
      if (supaClinics && supaClinics.length > 0) {
        return NextResponse.json({ clinics: supaClinics });
      }
    }
    const clinics = getAllClinics();
    return NextResponse.json({ clinics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
