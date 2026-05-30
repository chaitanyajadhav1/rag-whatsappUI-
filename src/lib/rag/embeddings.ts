import { CohereEmbeddings } from "@langchain/cohere";

let embeddingsInstance: CohereEmbeddings | null = null;

export function getEmbeddings(): CohereEmbeddings {
  if (!embeddingsInstance) {
    embeddingsInstance = new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY,
      model: "embed-english-v3.0",
    });
  }
  return embeddingsInstance;
}
