import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    const conversations = await prisma.conversation.findMany({
      where: {
        user: { id: user.id },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    return new Response("Error retrieving conversations.", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    await prisma.conversation.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "All conversations deleted successfully.",
    });
  } catch (error) {
    return new Response("Error deleting all conversations.", { status: 500 });
  }
}
