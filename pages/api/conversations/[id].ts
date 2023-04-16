import prisma from "@/lib/prisma";
import { Session } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Session = await getServerSession(req, res, authOptions);
  const conversationId = req.query.id?.toString();

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

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  if (conversation.userId !== session?.user.id) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  res.json(conversation);
}
