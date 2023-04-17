import prisma from "@/lib/prisma";
import { Conversation } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface UpdateConversation {
  name: string;
  conversationId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { name, conversationId }: UpdateConversation = req.body;

    const updatedConversation: Conversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        name,
      },
    });

    res.status(200).json(updatedConversation);
  } else {
    res.status(404).json({ message: "Not found" });
  }
}
