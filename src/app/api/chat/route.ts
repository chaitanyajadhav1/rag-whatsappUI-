import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { queryRAG } from "@/lib/rag/pipeline";
import { isConfigured } from "@/lib/config";

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { conversationId, message } = await request.json();

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: "conversationId and message are required" },
        { status: 400 }
      );
    }

    // Verify conversation ownership
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId: auth.userId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        role: "user",
        content: message,
        conversationId,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    let aiResponse: string;
    let sources: Array<{ content: string; metadata: Record<string, unknown> }> = [];

    if (isConfigured()) {
      // Use RAG pipeline
      try {
        console.log(`[Chat] Querying RAG - namespace: "${conversation.namespace}", question: "${message}", user: "${auth.userId}"`);
        const ragResult = await queryRAG(message, conversation.namespace, auth.userId);
        console.log(`[Chat] RAG returned ${ragResult.sources.length} sources, answer length: ${ragResult.answer.length}`);
        aiResponse = ragResult.answer;
        sources = ragResult.sources;
      } catch (ragError) {
        console.error("[Chat] RAG pipeline error:", ragError);
        aiResponse =
          "I apologize, but I encountered an error while searching the documents. Please try again or contact support.";
      }
    } else {
      // Demo mode - no API keys configured
      aiResponse = `Thank you for your question: "${message}"\n\nThis is a demo response. To get real AI-powered answers from your documents, please configure your API keys (Pinecone, Cohere, and Groq) in the .env.local file.`;
    }

    // Save AI response
    const assistantMessage = await prisma.message.create({
      data: {
        role: "assistant",
        content: aiResponse,
        sources: sources.length > 0 ? JSON.stringify(sources) : null,
        conversationId,
      },
    });

    return NextResponse.json({
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        sources: sources,
        createdAt: assistantMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
