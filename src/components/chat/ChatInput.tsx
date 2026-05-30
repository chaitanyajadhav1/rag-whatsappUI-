"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttach?: () => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onAttach, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSending = useAppStore((s) => s.isSending);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || isSending) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="flex items-end gap-2 px-4 py-3"
      style={{ background: "var(--bg-panel)" }}
    >
      {/* Attach button */}
      {onAttach && (
        <button
          onClick={onAttach}
          className="p-2.5 rounded-full transition-colors hover:opacity-80 shrink-0"
          style={{ color: "var(--text-secondary)" }}
          title="Attach document"
        >
          <Paperclip className="w-5 h-5" />
        </button>
      )}

      {/* Emoji button */}
      <button
        className="p-2.5 rounded-full transition-colors hover:opacity-80 shrink-0"
        style={{ color: "var(--text-secondary)" }}
        title="Emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {/* Input */}
      <div
        className="flex-1 rounded-xl px-4 py-2.5 min-h-[42px] flex items-center"
        style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)" }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message"
          disabled={disabled || isSending}
          className="w-full bg-transparent text-sm resize-none outline-none max-h-[120px]"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || disabled || isSending}
        className="p-2.5 rounded-full transition-all shrink-0 disabled:opacity-30 hover:opacity-80"
        style={{
          background: "var(--accent)",
          color: "white",
        }}
        title="Send"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
