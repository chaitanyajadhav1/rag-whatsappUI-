"use client";

import { MoreVertical, ArrowLeft, FileText } from "lucide-react";
import { Conversation } from "@/lib/store";
import { useAppStore } from "@/lib/store";

interface ChatHeaderProps {
  conversation: Conversation;
  onViewDocs?: () => void;
}

export default function ChatHeader({
  conversation,
  onViewDocs,
}: ChatHeaderProps) {
  const setShowSidebar = useAppStore((s) => s.setShowSidebar);

  // Generate avatar initials
  const initials = conversation.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 shrink-0"
      style={{
        background: "var(--bg-sidebar)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Back button (mobile) */}
      <button
        className="md:hidden p-1.5 rounded-lg transition-colors hover:opacity-80"
        style={{ color: "var(--text-secondary)" }}
        onClick={() => setShowSidebar(true)}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
        style={{ background: "var(--accent)", color: "white" }}
      >
        {initials}
      </div>

      {/* Name & namespace */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-sm font-semibold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {conversation.name}
        </h3>
        <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
          {conversation.namespace !== "default"
            ? `Namespace: ${conversation.namespace}`
            : "General namespace"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {onViewDocs && (
          <button
            onClick={onViewDocs}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
            title="View documents"
          >
            <FileText className="w-5 h-5" />
          </button>
        )}
        <button
          className="p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
