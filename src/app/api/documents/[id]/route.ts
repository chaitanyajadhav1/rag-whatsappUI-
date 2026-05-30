import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { deleteFile } from "@/lib/supabase";
import { deleteDocumentVectors } from "@/lib/rag/vectorstore";
import { isConfigured } from "@/lib/config";

// DELETE - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify ownership
    const document = await prisma.document.findFirst({
      where: { id, userId: auth.userId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete from Pinecone (if configured)
    if (isConfigured()) {
      try {
        await deleteDocumentVectors(document.id, document.namespace, auth.userId);
      } catch (err) {
        console.warn("Failed to delete vectors:", err);
      }
    }

    // Delete from Supabase Storage
    try {
      await deleteFile(document.storagePath);
    } catch (err) {
      console.warn("Failed to delete from storage:", err);
    }

    // Delete from database
    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
