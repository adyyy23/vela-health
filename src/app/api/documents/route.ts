import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPatientDocuments } from "@/lib/data";
export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "PATIENT")
    return NextResponse.json(
      { error: "Patient access required" },
      { status: 403 },
    );
  return NextResponse.json(
    { documents: await getPatientDocuments(user.id) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
