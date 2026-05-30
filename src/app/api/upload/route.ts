import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { uploadFile, downloadFile } from "@/lib/supabase";
import { indexDocument } from "@/lib/rag/pipeline";
import { getFileType } from "@/lib/rag/loaders";
import { isConfigured } from "@/lib/config";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export async function POST(request: NextRequest) {
  const auth = getAuthUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const namespace = (formData.get("namespace") as string) || "default";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = getFileType(file.name);
    if (!fileType) {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, CSV, XLSX, and XLS are allowed." },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${auth.userId}/${namespace}/${Date.now()}-${sanitizedFileName}`;
    
    let uploadedPath = storagePath;
    try {
      console.log("[Upload] Uploading to Supabase:", storagePath, "contentType:", file.type, "size:", buffer.length);
      uploadedPath = await uploadFile(buffer, storagePath, file.type);
      console.log("[Upload] Supabase upload SUCCESS:", uploadedPath);
    } catch (uploadError) {
      console.error("[Upload] Supabase upload FAILED:", uploadError);
      // Continue without Supabase if not configured
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: fileType,
        size: buffer.length,
        storagePath: uploadedPath,
        namespace,
        status: "pending",
        userId: auth.userId,
      },
    });

    // Trigger async indexing if RAG is configured
    if (isConfigured()) {
      // Update status to processing
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "processing" },
      });

      // Process in background (non-blocking)
      processDocument(document.id, buffer, file.name, fileType, namespace, auth.userId).catch(
        (err) => {
          console.error("Background processing error:", err);
        }
      );
    } else {
      // Mark as indexed in demo mode
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "indexed" },
      });
    }

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function processDocument(
  documentId: string,
  buffer: Buffer,
  fileName: string,
  fileType: "pdf" | "csv" | "xlsx" | "xls",
  namespace: string,
  userId: string
) {
  // Write to temp file
  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `${Date.now()}-${fileName}`);

  try {
    fs.writeFileSync(tempPath, buffer);
    console.log("[Index] Temp file written:", tempPath, "size:", buffer.length);

    // Run indexing pipeline
    console.log("[Index] Starting indexing for:", fileName, "type:", fileType, "namespace:", namespace, "user:", userId);
    await indexDocument(tempPath, documentId, namespace, fileType, userId);
    console.log("[Index] Indexing complete for:", fileName);

    // Update status to indexed
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "indexed" },
    });
    console.log("[Index] Status updated to 'indexed' for:", documentId);
  } catch (error) {
    console.error("[Index] Indexing error for", fileName, ":", error);
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "error",
        errorMsg: error instanceof Error ? error.message : "Unknown error",
      },
    });
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync(tempPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
