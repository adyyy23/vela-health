import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { toggleSavedItem, getSavedItemsForPatient } from "@/lib/data";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = getSavedItemsForPatient(user.id);
    return NextResponse.json({ saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemType, itemId } = await request.json();
    if (!itemType || !itemId) {
      return NextResponse.json({ error: "itemType and itemId are required." }, { status: 400 });
    }

    const isSaved = toggleSavedItem(user.id, itemType, itemId);
    return NextResponse.json({ success: true, isSaved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
