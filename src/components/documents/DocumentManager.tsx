"use client";

import { useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { useDocuments, useUploadDocument, useDeleteDocument } from "@/hooks/useDocuments";
import DocumentTable from "./DocumentTable";
import UploadDialog from "./UploadDialog";

export default function DocumentManager() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { data: documents = [], refetch, isLoading } = useDocuments();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const handleUpload = async (files: File[], namespace: string) => {
    for (const file of files) {
      await uploadDocument.mutateAsync({ file, namespace });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-chat)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{
          background: "var(--bg-sidebar)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Documents
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
            title="Refresh"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Document Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border-color)",
          }}
        >
          <DocumentTable documents={documents} onDelete={handleDelete} />
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
