import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { loadDocument, SupportedFileType } from "./loaders";
import { upsertDocuments, queryDocuments } from "./vectorstore";
import { getLLM } from "./llm";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function indexDocument(
  filePath: string,
  documentId: string,
  namespace: string,
  fileType: SupportedFileType,
  userId: string
): Promise<void> {
  // 1. Load documents
  const docs = await loadDocument(filePath, fileType);

  // 2. Split into chunks
  let chunks = await textSplitter.splitDocuments(docs);
  
  // Filter out chunks with empty text
  chunks = chunks.filter(chunk => chunk.pageContent && chunk.pageContent.trim().length > 0);

  if (!chunks || chunks.length === 0) {
    throw new Error("No extractable text found in this document (it might be empty or an image-only PDF).");
  }

  console.log(`[Pipeline] Document loaded: ${chunks.length} chunks from ${fileType} file`);

  // 3. Upsert to Pinecone (Pinecone handles embedding via integrated model)
  await upsertDocuments(chunks, namespace, documentId, userId);
  console.log(`[Pipeline] Indexing complete for document ${documentId}`);
}

export interface RAGResponse {
  answer: string;
  sources: Array<{
    content: string;
    metadata: Record<string, unknown>;
  }>;
}

export async function queryRAG(
  question: string,
  namespace: string,
  userId: string
): Promise<RAGResponse> {
  // 1. Retrieve relevant chunks (filtered by userId)
  const relevantDocs = await queryDocuments(question, namespace, 5, userId);
  console.log(`[RAG] Retrieved ${relevantDocs.length} relevant docs from namespace "${namespace}" for user ${userId}`);
  relevantDocs.forEach((doc, i) => {
    console.log(`[RAG] Doc ${i+1}: "${doc.pageContent.substring(0, 80)}..." (score: ${doc.metadata?.score})`);
  });

  // 2. Build context
  const context = relevantDocs
    .map((doc: Document, i: number) => `[Source ${i + 1}]: ${doc.pageContent}`)
    .join("\n\n");

  // 3. Generate response
  const llm = getLLM();
  const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context from business documents. 
  
Rules:
- Answer ONLY based on the provided context
- If the context doesn't contain the answer, say "I couldn't find this information in the uploaded documents."
- Be precise with numbers, prices, and product names
- Format lists and tables clearly using markdown when appropriate
- Include specific details from the documents
- Use the Indian Rupee symbol (₹) for prices if applicable`;

  const userPrompt = `Context from documents:
${context}

User Question: ${question}

Please provide a detailed and accurate answer based on the context above.`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const sources = relevantDocs.map((doc: Document) => ({
    content: doc.pageContent.substring(0, 200),
    metadata: doc.metadata,
  }));

  return {
    answer: response.content as string,
    sources,
  };
}
