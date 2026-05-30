import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// GET - List all conversations for authenticated user
export async function GET(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: auth.userId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            role: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const result = conversations.map((conv: any) => ({
      id: conv.id,
      name: conv.name,
      namespace: conv.namespace,
      lastMessage: conv.messages[0]?.content || null,
      lastMessageRole: conv.messages[0]?.role || null,
      lastMessageAt: conv.messages[0]?.createdAt || conv.createdAt,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new conversation
export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, namespace } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Conversation name is required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        name,
        namespace: namespace || "default",
        userId: auth.userId,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
