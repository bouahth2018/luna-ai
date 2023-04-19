import { Session } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session: Session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  if (req.method === "DELETE") {
    try {
      const userId = session.user.id;
      const lastTwoMessages = await prisma.message.findMany({
        where: {
          userId: userId,
        },
        take: 2,
        orderBy: {
          created_at: "desc",
        },
      });

      const deletedMessages = await prisma.message.deleteMany({
        where: {
          id: {
            in: lastTwoMessages.map((message) => message.id),
          },
        },
      });

      res.status(200).json(deletedMessages);
    } catch (error) {
      res.status(500).json({ error: "Error deleting messages." });
    }
  } else {
    res.status(400).json({ error: "Invalid request method." });
  }
}
