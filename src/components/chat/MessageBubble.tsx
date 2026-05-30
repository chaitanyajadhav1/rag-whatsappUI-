"use client";

import { format } from "date-fns";
import { Message } from "@/lib/store";
import { FileText } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-4 py-0.5 animate-[slide-up_0.15s_ease-out]`}
    >
      <div
        className={`relative max-w-[75%] md:max-w-[65%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bubble-tail-out"
            : "rounded-tl-sm bubble-tail-in"
        }`}
        style={{
          background: isUser
            ? "var(--bg-bubble-out)"
            : "var(--bg-bubble-in)",
          color: "var(--text-primary)",
        }}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div
            className="mt-2 pt-2 space-y-1"
            style={{ borderTop: "1px solid rgba(134, 150, 160, 0.2)" }}
          >
            <p
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <FileText className="w-3 h-3" />
              Sources
            </p>
            {message.sources.slice(0, 3).map((source, idx) => (
              <p
                key={idx}
                className="text-xs truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {source.content.substring(0, 100)}...
              </p>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`flex items-center gap-1 mt-1 ${isUser ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}
