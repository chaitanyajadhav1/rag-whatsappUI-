"use client";

import { format } from "date-fns";
import { Trash2, FileText, FileSpreadsheet } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { DocumentItem } from "@/lib/store";

interface DocumentTableProps {
  documents: DocumentItem[];
  onDelete?: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-400" />;
    case "csv":
      return <FileText className="w-5 h-5 text-green-400" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    default:
      return <FileText className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />;
  }
}

export default function DocumentTable({ documents, onDelete }: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText
          className="w-12 h-12 mb-3"
          style={{ color: "var(--text-secondary)", opacity: 0.3 }}
        />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          No documents uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <th
              className="text-left text-xs font-semibold px-4 py-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Document
            </th>
            <th
              className="text-left text-xs font-semibold px-4 py-3 hidden sm:table-cell"
              style={{ color: "var(--text-secondary)" }}
            >
              Namespace
            </th>
            <th
              className="text-left text-xs font-semibold px-4 py-3 hidden md:table-cell"
              style={{ color: "var(--text-secondary)" }}
            >
              Size
            </th>
            <th
              className="text-left text-xs font-semibold px-4 py-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Status
            </th>
            <th
              className="text-left text-xs font-semibold px-4 py-3 hidden sm:table-cell"
              style={{ color: "var(--text-secondary)" }}
            >
              Date
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="group transition-colors"
              style={{ borderBottom: "1px solid var(--border-color)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate max-w-[200px]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {doc.name}
                    </p>
                    <p
                      className="text-xs sm:hidden"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {doc.namespace}
                    </p>
                  </div>
                </div>
              </td>
              <td
                className="px-4 py-3 text-xs hidden sm:table-cell"
                style={{ color: "var(--text-secondary)" }}
              >
                {doc.namespace}
              </td>
              <td
                className="px-4 py-3 text-xs hidden md:table-cell"
                style={{ color: "var(--text-secondary)" }}
              >
                {formatFileSize(doc.size)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={doc.status} errorMsg={doc.errorMsg} />
              </td>
              <td
                className="px-4 py-3 text-xs hidden sm:table-cell"
                style={{ color: "var(--text-secondary)" }}
              >
                {format(new Date(doc.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3">
                {onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--text-secondary)" }}
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
