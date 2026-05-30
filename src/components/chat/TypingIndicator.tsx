"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 px-4 py-1 animate-[fade-in_0.2s_ease-out]">
      <div
        className="px-4 py-3 rounded-xl rounded-tl-sm max-w-fit relative bubble-tail-in"
        style={{ background: "var(--bg-bubble-in)" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-[bounce-dots_1.4s_infinite_ease-in-out_both]"
            style={{ background: "var(--text-secondary)", animationDelay: "0s" }}
          />
          <span
            className="w-2 h-2 rounded-full animate-[bounce-dots_1.4s_infinite_ease-in-out_both]"
            style={{ background: "var(--text-secondary)", animationDelay: "0.16s" }}
          />
          <span
            className="w-2 h-2 rounded-full animate-[bounce-dots_1.4s_infinite_ease-in-out_both]"
            style={{ background: "var(--text-secondary)", animationDelay: "0.32s" }}
          />
        </div>
      </div>
    </div>
  );
}
