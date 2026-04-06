import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

interface IParams {
	conversationId?: string;
}

export async function DELETE(_request: Request, { params }: { params: Promise<IParams> }) {
	try {
		const { conversationId } = await params;
		const currentUser = await getCurrentUser();

		console.log(conversationId);

		if (!currentUser?.id) {
			return NextResponse.json(null);
		}

		const existingConversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		});

		if (!existingConversation) {
			return new NextResponse("Invalid Id", { status: 404 });
		}

		const deletedConversation = await prisma.conversation.deleteMany({
			where: {
				id: conversationId,
				userIds: {
					hasSome: [currentUser.id],
				},
			},
		});

		return NextResponse.json(deletedConversation);
	} catch (error) {
		return NextResponse.json(null);
	}
}
