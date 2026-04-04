import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    const body = await request.json()

    const {userId} = body;

    if(!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", {status: 400})
    }

    const existingConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals:[currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals:[userId, currentUser.id]
            }
          }
        ]
      }
    })
    
    const singleConversation = existingConversation[0]

    if(singleConversation) {
      return NextResponse.json(singleConversation)
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    })

    return NextResponse.json(newConversation)
  } catch(error) {
    return new NextResponse("Internal Error", {status: 500})
  }
}