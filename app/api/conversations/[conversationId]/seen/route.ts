import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

interface IParams {
	conversationId?: string;
}

export async function POST(
	_request: Request,
	{ params }: { params: Promise<IParams> },
) {
  try {
      const { conversationId } = await params;
			const currentUser = await getCurrentUser();

			if (!currentUser?.id || !currentUser?.email) {
				return new NextResponse("Unauthorized", { status: 401 });
			}

			const conversation = await prisma.conversation.findUnique({
				where: { id: conversationId },
				include: {
					messages: {
						include: { seen: true },
					},
				},
			});

			if (!conversation) {
				return new NextResponse("Invalid ID", { status: 400 });
			}

			const unseenMessages = conversation.messages.filter(
				(m) => !m.seenIds.includes(currentUser.id)
			);

			if (unseenMessages.length === 0) {
				return new NextResponse("Success");
			}

			await Promise.all(
				unseenMessages.map((m) =>
					prisma.message.update({
						where: { id: m.id },
						data: { seen: { connect: { id: currentUser.id } } },
					})
				)
			);

			const lastMessage = await prisma.message.findFirst({
				where: { conversationId: conversationId! },
				orderBy: { createdAt: "desc" },
				include: { seen: true, sender: true },
			});

			if (!lastMessage) {
				return new NextResponse("Success");
			}

			await pusherServer.trigger(currentUser.email!, "conversation:update", {
				id: conversationId,
				messages: [lastMessage],
			});

			await pusherServer.trigger(conversationId!, "messages:update", lastMessage);

			return new NextResponse("Success");

  } catch (error) {
    return new NextResponse("Error", {status: 500});
  }

}
