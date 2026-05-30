"use client";

interface StatusBadgeProps {
  status: "pending" | "processing" | "indexed" | "error";
  errorMsg?: string | null;
}

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#F59E0B",
    dot: "#F59E0B",
  },
  processing: {
    label: "Processing",
    bg: "rgba(59, 130, 246, 0.15)",
    color: "#3B82F6",
    dot: "#3B82F6",
  },
  indexed: {
    label: "Indexed",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#10B981",
    dot: "#10B981",
  },
  error: {
    label: "Error",
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#EF4444",
    dot: "#EF4444",
  },
};

export default function StatusBadge({ status, errorMsg }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        status === "processing" ? "status-processing" : ""
      }`}
      style={{ background: config.bg, color: config.color }}
      title={errorMsg || undefined}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: config.dot }}
      />
      {config.label}
    </span>
  );
}
