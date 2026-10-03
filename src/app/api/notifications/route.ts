import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getNotificationsForUser, markNotificationRead } from "@/lib/data";
export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(
    { notifications: getNotificationsForUser(user.id) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (typeof body.id !== "string")
    return NextResponse.json(
      { error: "Notification ID is required." },
      { status: 400 },
    );
  markNotificationRead(body.id, user.id);
  return NextResponse.json({ success: true });
}
