import prisma from "@/libs/prismadb";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: true,
        seen: true,
        replyTo: {
          include: { sender: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return messages;
  } catch {
    return [];
  }
};

export default getMessages;
