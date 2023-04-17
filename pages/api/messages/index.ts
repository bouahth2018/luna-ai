import prisma from "@/lib/prisma";
import { User, Conversation, Message } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface NewMessage {
  role: string;
  content: string;
  userId: string;
  conversationId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { role, content, userId, conversationId }: NewMessage = req.body;

    let conversation: Conversation | null = null;

    if (!conversationId) {
      // if no conversation is selected, create a new one
      conversation = await prisma.conversation.create({
        data: {
          name: "New Chat",
          user: {
            connect: { id: userId },
          },
        },
      });
    } else {
      // if conversation is selected, use it
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });
    }

    // create new message in conversation
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

    res.status(200).json(newMessage);
  } else {
    res.status(404).json({ message: "Not found" });
  }
}
