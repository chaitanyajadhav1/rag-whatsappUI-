"use client";

import { MessageSquare, FileText, Upload } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex-1 flex items-center justify-center chat-bg-pattern">
      <div className="text-center max-w-md px-6 animate-[fade-in_0.3s_ease-out]">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(0, 168, 132, 0.15)" }}
        >
          <MessageSquare
            className="w-10 h-10"
            style={{ color: "var(--accent)" }}
          />
        </div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          HeidalAI Chat
        </h2>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Upload your business documents and start asking questions.
          Get AI-powered answers from your product catalogs, price lists,
          and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium"
            style={{
              background: "var(--bg-panel)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <FileText className="w-4 h-4" style={{ color: "var(--accent)" }} />
            PDF, CSV, Excel
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium"
            style={{
              background: "var(--bg-panel)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Upload className="w-4 h-4" style={{ color: "var(--accent)" }} />
            Drag &amp; Drop
          </div>
        </div>
      </div>
    </div>
  );
}
