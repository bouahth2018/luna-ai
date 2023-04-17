import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const conversationId = req.query.id?.toString();

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    res.status(200).json({ message: "Conversation deleted successfully." });
  } else {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
}
