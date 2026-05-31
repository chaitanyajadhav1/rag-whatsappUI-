"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet, ChevronDown, ChevronUp, File, CheckCircle2, Loader2, AlertCircle, Clock } from "lucide-react";
import { DocumentItem } from "@/lib/store";

interface ChatDocumentsProps {
  documents: DocumentItem[];
}

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4" />;
    case "xlsx":
    case "xls":
    case "csv":
      return <FileSpreadsheet className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "indexed":
      return <CheckCircle2 className="w-3 h-3" style={{ color: "#10B981" }} />;
    case "processing":
      return <Loader2 className="w-3 h-3 animate-spin" style={{ color: "#3B82F6" }} />;
    case "error":
      return <AlertCircle className="w-3 h-3" style={{ color: "#EF4444" }} />;
    default:
      return <Clock className="w-3 h-3" style={{ color: "#F59E0B" }} />;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChatDocuments({ documents }: ChatDocumentsProps) {
  const [expanded, setExpanded] = useState(false);

  if (documents.length === 0) return null;

  const indexedCount = documents.filter((d) => d.status === "indexed").length;

  return (
    <div
      style={{
        background: "var(--bg-panel)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition-colors hover:opacity-90"
        style={{ color: "var(--text-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
          <span>
            {indexedCount} of {documents.length} document{documents.length !== 1 ? "s" : ""} indexed
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Document list */}
      {expanded && (
        <div
          className="px-3 pb-2 space-y-1 max-h-[160px] overflow-y-auto animate-[scale-in_0.15s_ease-out]"
        >
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
              style={{
                background: "var(--bg-hover)",
              }}
            >
              {/* File icon */}
              <div
                className="shrink-0"
                style={{ color: "var(--accent)" }}
              >
                {getFileIcon(doc.type)}
              </div>

              {/* File name & size */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {doc.name}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {formatSize(doc.size)} · {doc.type.toUpperCase()}
                </p>
              </div>

              {/* Status */}
              <div className="shrink-0 flex items-center gap-1">
                {getStatusIcon(doc.status)}
                <span
                  className="text-[10px] capitalize"
                  style={{
                    color:
                      doc.status === "indexed"
                        ? "#10B981"
                        : doc.status === "error"
                        ? "#EF4444"
                        : doc.status === "processing"
                        ? "#3B82F6"
                        : "#F59E0B",
                  }}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
