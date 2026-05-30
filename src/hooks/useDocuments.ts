"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { DocumentItem } from "@/lib/store";

export function useDocuments(namespace?: string) {
  const { getAuthHeaders } = useAuth();

  return useQuery<DocumentItem[]>({
    queryKey: ["documents", namespace],
    queryFn: async () => {
      const params = namespace ? `?namespace=${namespace}` : "";
      const res = await fetch(`/api/documents${params}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      namespace,
    }: {
      file: File;
      namespace?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (namespace) formData.append("namespace", namespace);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete document");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
