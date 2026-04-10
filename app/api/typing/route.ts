import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { conversationId, isTyping } = body

    await pusherServer.trigger(conversationId, "typing", {
      userName: currentUser.name,
      isTyping,
    })

    return NextResponse.json({ success: true })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
