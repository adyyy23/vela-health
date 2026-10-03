import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getConversationsForUser, getMessagesForConversation, sendInAppMessage } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const messages = getMessagesForConversation(conversationId, user.id);
      return NextResponse.json({ messages });
    }

    const conversations = getConversationsForUser(user.id);
    return NextResponse.json({ conversations });
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

    const body = await request.json();
    const { conversationId, content } = body;

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: "conversationId and content are required." }, { status: 400 });
    }

    const msg = sendInAppMessage({
      conversationId,
      senderId: user.id,
      content: content.trim(),
    });

    if (!msg) {
      return NextResponse.json({ error: "Failed to send message." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: msg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
