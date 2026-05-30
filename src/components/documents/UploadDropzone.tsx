"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, FileSpreadsheet } from "lucide-react";

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
}

export default function UploadDropzone({
  onFilesSelected,
  isUploading,
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    disabled: isUploading,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-xl p-8 text-center cursor-pointer transition-all ${
        isDragActive ? "dropzone-active" : ""
      }`}
      style={{
        border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border-color)"}`,
        background: isDragActive
          ? "rgba(0, 168, 132, 0.05)"
          : "transparent",
      }}
    >
      <input {...getInputProps()} />

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(0, 168, 132, 0.15)" }}
      >
        <Upload className="w-7 h-7" style={{ color: "var(--accent)" }} />
      </div>

      {isDragActive ? (
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
          Drop files here...
        </p>
      ) : (
        <>
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {isUploading ? "Uploading..." : "Drag & drop files here"}
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            or click to browse
          </p>
          <div className="flex items-center justify-center gap-3">
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--bg-panel)",
                color: "var(--text-secondary)",
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </div>
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--bg-panel)",
                color: "var(--text-secondary)",
              }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel
            </div>
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--bg-panel)",
                color: "var(--text-secondary)",
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              CSV
            </div>
          </div>
        </>
      )}
    </div>
  );
}
