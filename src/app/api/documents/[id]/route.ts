import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "PATIENT")
    return NextResponse.json(
      { error: "Patient access required" },
      { status: 403 },
    );
  const { id } = await params;
  const doc = getDb()
    .prepare(
      "SELECT title,file_path_or_summary FROM patient_documents WHERE id=? AND patient_id=?",
    )
    .get(id, user.id) as
    | { title: string; file_path_or_summary: string }
    | undefined;
  if (!doc)
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  return new Response(doc.title + "\n\n" + doc.file_path_or_summary, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="vela-document-${id.replace(/[^a-zA-Z0-9_-]/g, "")}.txt"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
