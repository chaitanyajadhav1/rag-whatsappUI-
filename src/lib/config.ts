export const config = {
  appMode: (process.env.NEXT_PUBLIC_APP_MODE || "multi-vendor") as
    | "multi-vendor"
    | "single",

  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || "",
    indexName: process.env.PINECONE_INDEX_NAME || "",
  },

  cohere: {
    apiKey: process.env.COHERE_API_KEY || "",
    model: "embed-english-v3.0",
  },

  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
    model: "llama-3.3-70b-versatile",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret",
  },
};

export function isConfigured(): boolean {
  return !!(
    config.pinecone.apiKey &&
    config.pinecone.indexName &&
    config.cohere.apiKey &&
    config.groq.apiKey
  );
}
