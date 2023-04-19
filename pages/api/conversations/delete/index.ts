import prisma from "@/lib/prisma";
import { Session } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  if (req.method === "DELETE") {
    const userId = session.user?.id;
    await prisma.conversation.deleteMany({
      where: {
        userId: userId,
      },
    });

    res
      .status(200)
      .json({ message: "All conversations deleted successfully." });
  } else {
    res.status(500).json({ error: "Failed to delete all conversations" });
  }
}
