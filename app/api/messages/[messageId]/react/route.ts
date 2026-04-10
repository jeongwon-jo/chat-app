import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/libs/pusher";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  messageId: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<IParams> },
) {
  try {
    const { messageId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.name) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { emoji } = await request.json();

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const reactions = message.reactions ?? [];

    // 같은 이모지를 이미 눌렀으면 제거(토글), 아니면 기존 내 반응 교체 후 추가
    const alreadyReacted = reactions.find(
      (r) => r.userId === currentUser.id && r.emoji === emoji,
    );

    const filtered = reactions.filter((r) => r.userId !== currentUser.id);
    const newReactions = alreadyReacted
      ? filtered
      : [...filtered, { emoji, userId: currentUser.id, userName: currentUser.name }];

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { reactions: newReactions },
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
