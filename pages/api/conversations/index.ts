import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Session } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const userId = session.user?.id;
    const conversations = await prisma.conversation.findMany({
      where: {
        user: { id: userId },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
