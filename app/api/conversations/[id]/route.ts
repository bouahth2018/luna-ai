import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Conversation } from "@prisma/client";

interface Params {
  params: {
    id: string;
  };
}

interface UpdateConversation {
  name: string;
  conversationId: string;
}

export async function GET(request: Request, { params }: Params) {
  try {
    // Get the route params
    const conversationId = params.id;

    // Check if the user has access to this conversation
    if (!(await verifyCurrentUserHasAccessToConversation(conversationId))) {
      return new Response("Unauthorized access", { status: 403 });
    }

    // Get the conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          select: {
            role: true,
            content: true,
          },
          orderBy: {
            created_at: "asc",
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    return new Response("Error retrieving conversation.", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Get the request body
    const { name, conversationId }: UpdateConversation = await request.json();

    // Update the conversation name
    const updatedConversation: Conversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedConversation);
  } catch (error) {
    return new Response("Error updating conversation name.", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    // Get the route params
    const conversationId = params.id;

    // Check if the user has access to this conversation
    if (!(await verifyCurrentUserHasAccessToConversation(conversationId))) {
      return new Response("Unauthorized access", { status: 403 });
    }

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json({ message: "Conversation deleted successfully." });
  } catch (error) {
    return new Response("Error deleting conversation.");
  }
}

async function verifyCurrentUserHasAccessToConversation(id: string) {
  const session = await getServerSession(authOptions);
  const count = await prisma.conversation.count({
    where: {
      id: id,
      userId: session?.user.id,
    },
  });

  return count > 0;
}
