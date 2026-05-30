"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/lib/store";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

function DateSeparator({ date }: { date: Date }) {
  let label: string;
  if (isToday(date)) {
    label = "Today";
  } else if (isYesterday(date)) {
    label = "Yesterday";
  } else {
    label = format(date, "MMMM d, yyyy");
  }

  return (
    <div className="flex items-center justify-center py-3">
      <span
        className="text-xs px-4 py-1 rounded-lg font-medium"
        style={{
          background: "var(--bg-panel)",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto py-2 chat-bg-pattern"
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No messages yet. Start a conversation!
          </p>
        </div>
      )}

      {messages.map((message, index) => {
        const currentDate = new Date(message.createdAt);
        const prevDate =
          index > 0 ? new Date(messages[index - 1].createdAt) : null;
        const showDateSeparator = !prevDate || !isSameDay(currentDate, prevDate);

        return (
          <div key={message.id}>
            {showDateSeparator && <DateSeparator date={currentDate} />}
            <MessageBubble message={message} />
          </div>
        );
      })}

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
