import { ChatGroq } from "@langchain/groq";

let llmInstance: ChatGroq | null = null;

export function getLLM(): ChatGroq {
  if (!llmInstance) {
    llmInstance = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      maxTokens: 2048,
    });
  }
  return llmInstance;
}
