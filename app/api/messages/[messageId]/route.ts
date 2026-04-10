import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/libs/pusher";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  messageId: string;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<IParams> },
) {
  try {
    const { messageId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.senderId !== currentUser.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      include: {
        sender: true,
        seen: true,
        replyTo: { include: { sender: true } },
      },
    });

    await pusherServer.trigger(updated.conversationId, "messages:update", updated);

    return NextResponse.json(updated);
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
