"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import UploadDropzone from "./UploadDropzone";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], namespace: string) => Promise<void>;
}

export default function UploadDialog({
  isOpen,
  onClose,
  onUpload,
}: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [namespace, setNamespace] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    try {
      await onUpload(selectedFiles, namespace || "default");
      setSelectedFiles([]);
      setNamespace("");
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-[fade-in_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 animate-[scale-in_0.2s_ease-out]"
        style={{
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Upload Documents
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Upload files to index them for AI-powered search
        </p>

        {/* Dropzone */}
        <UploadDropzone
          onFilesSelected={(files) =>
            setSelectedFiles((prev) => [...prev, ...files])
          }
          isUploading={isUploading}
        />

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Selected files ({selectedFiles.length})
            </p>
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: "var(--bg-panel)" }}
              >
                <span
                  className="text-sm truncate flex-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {file.name}
                </span>
                <button
                  onClick={() =>
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))
                  }
                  className="ml-2 p-1 rounded hover:opacity-80"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Namespace */}
        <div className="mt-4">
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Namespace / Vendor (optional)
          </label>
          <input
            type="text"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            placeholder="e.g., amd, msi, corsair"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: "var(--bg-panel)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "var(--accent)" }}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
