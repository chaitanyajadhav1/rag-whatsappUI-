"use client";

import { format, isToday, isYesterday } from "date-fns";
import { Conversation } from "@/lib/store";
import { Trash2 } from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationItemProps) {
  const initials = conversation.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const lastTime = conversation.lastMessageAt
    ? new Date(conversation.lastMessageAt)
    : new Date(conversation.createdAt);

  let timeLabel: string;
  if (isToday(lastTime)) {
    timeLabel = format(lastTime, "HH:mm");
  } else if (isYesterday(lastTime)) {
    timeLabel = "Yesterday";
  } else {
    timeLabel = format(lastTime, "dd/MM/yy");
  }

  return (
    <div
      className="group flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors"
      style={{
        background: isActive ? "var(--bg-hover)" : "transparent",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.background =
            "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
        style={{ background: "var(--accent)", color: "white" }}
      >
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4
            className="text-sm font-medium truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {conversation.name}
          </h4>
          <span
            className="text-xs shrink-0"
            style={{ color: "var(--text-secondary)" }}
          >
            {timeLabel}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className="text-xs truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {conversation.lastMessage || "No messages yet"}
          </p>
          {/* Delete (show on hover) */}
          {onDelete && (
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity shrink-0"
              style={{ color: "var(--text-secondary)" }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
