"use client";

export function MessageSkeleton() {
  return (
    <div className="px-4 py-2 animate-pulse">
      <div className="flex justify-start">
        <div
          className="rounded-xl rounded-tl-sm px-4 py-3 w-[60%]"
          style={{ background: "var(--bg-bubble-in)" }}
        >
          <div
            className="h-3 rounded-full mb-2 w-[80%]"
            style={{ background: "var(--bg-hover)" }}
          />
          <div
            className="h-3 rounded-full w-[50%]"
            style={{ background: "var(--bg-hover)" }}
          />
        </div>
      </div>
    </div>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
      <div
        className="w-12 h-12 rounded-full shrink-0"
        style={{ background: "var(--bg-hover)" }}
      />
      <div className="flex-1">
        <div
          className="h-3.5 rounded-full w-[60%] mb-2"
          style={{ background: "var(--bg-hover)" }}
        />
        <div
          className="h-3 rounded-full w-[80%]"
          style={{ background: "var(--bg-hover)" }}
        />
      </div>
    </div>
  );
}

export function DocumentSkeleton() {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 animate-pulse"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      <div
        className="w-10 h-10 rounded-lg shrink-0"
        style={{ background: "var(--bg-hover)" }}
      />
      <div className="flex-1">
        <div
          className="h-3.5 rounded-full w-[50%] mb-2"
          style={{ background: "var(--bg-hover)" }}
        />
        <div
          className="h-3 rounded-full w-[30%]"
          style={{ background: "var(--bg-hover)" }}
        />
      </div>
      <div
        className="w-16 h-6 rounded-full"
        style={{ background: "var(--bg-hover)" }}
      />
    </div>
  );
}
