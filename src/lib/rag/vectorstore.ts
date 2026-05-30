import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";

let pineconeClient: Pinecone | null = null;

function getPinecone(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });
  }
  return pineconeClient;
}

function getIndex() {
  return getPinecone().index(process.env.PINECONE_INDEX_NAME || "");
}

/**
 * Upsert documents using Pinecone's integrated embedding model (llama-text-embed-v2).
 * We send raw text — Pinecone handles embedding via its built-in model.
 * Uses the Pinecone SDK v7 API format.
 */
export async function upsertDocuments(
  docs: Document[],
  namespace: string,
  documentId: string,
  userId: string
): Promise<void> {
  const index = getIndex();

  // Build records for Pinecone's integrated inference
  // The index fieldMap is { text: "text" }, so the "text" field gets embedded
  const records = docs.map((doc, i) => ({
    id: `${documentId}-chunk-${i}`,
    text: doc.pageContent,
    documentId,
    source: (doc.metadata?.source as string) || "",
    chunkIndex: i,
    userId, // Store userId for tenant isolation
  }));

  // Upsert in batches of 96 (recommended for integrated models)
  const batchSize = 96;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(
      `[Vectorstore] Upserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${batch.length} records) for user ${userId}`
    );

    await index.upsertRecords({
      namespace,
      records: batch,
    });
  }

  console.log(
    `[Vectorstore] Successfully upserted ${records.length} chunks for document ${documentId}`
  );
}

/**
 * Query documents using Pinecone's integrated embedding model.
 * Pinecone handles embedding the query text internally via searchRecords.
 */
export async function queryDocuments(
  query: string,
  namespace: string,
  topK: number = 5,
  userId: string
): Promise<Document[]> {
  const index = getIndex();

  const results = await index.searchRecords({
    namespace,
    query: { 
      topK, 
      inputs: { text: query },
      filter: { userId: { $eq: userId } } // Enforce tenant isolation
    },
    fields: ["text", "documentId", "source", "chunkIndex"],
  });

  // Convert Pinecone results back to LangChain Documents
  const documents: Document[] = [];
  if (results.result?.hits) {
    for (const hit of results.result.hits) {
      const fields = (hit.fields || {}) as Record<string, unknown>;
      const text = (fields.text as string) || "";

      documents.push(
        new Document({
          pageContent: text,
          metadata: {
            documentId: fields.documentId,
            source: fields.source,
            chunkIndex: fields.chunkIndex,
            score: hit._score,
          },
        })
      );
    }
  }

  return documents;
}

export async function deleteDocumentVectors(
  documentId: string,
  namespace: string,
  userId: string
): Promise<void> {
  const index = getIndex();

  // Delete by metadata filter with tenant isolation
  await index.deleteMany({
    namespace,
    filter: { 
      documentId: { $eq: documentId },
      userId: { $eq: userId }
    },
  });
}
