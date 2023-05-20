import { Conversation, Message } from "@prisma/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface NewMessage {
  role: string;
  content: string;
  userId: string;
  conversationId?: string;
}

export async function POST(request: Request) {
  try {
    const { role, content, userId, conversationId }: NewMessage =
      await request.json();

    let conversation: Conversation | null = null;

    if (!conversationId) {
      // If no conversation is selected, create a new one
      conversation = await prisma.conversation.create({
        data: {
          name: "New Chat",
          user: {
            connect: { id: userId },
          },
        },
      });
    } else {
      // If conversation is selected, use it
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });
    }

    // Create a new message in conversation
    const newMessage: Message = await prisma.message.create({
      data: {
        role,
        content,
        user: {
          connect: { id: userId },
        },
        conversation: {
          connect: { id: conversation!.id },
        },
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    return new Response("Error creating a new message", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const lastTwoMessages = await prisma.message.findMany({
      where: {
        userId: user.id,
      },
      take: 2,
      orderBy: {
        created_at: "desc",
      },
    });

    await prisma.message.deleteMany({
      where: {
        id: {
          in: lastTwoMessages.map((message) => message.id),
        },
      },
    });

    return NextResponse.json({
      message: "Deleted last two messages successfully.",
    });
  } catch (error) {
    return new Response("Failed to delete messages", { status: 500 });
  }
}
