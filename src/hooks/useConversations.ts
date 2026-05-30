"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { Conversation } from "@/lib/store";

export function useConversations() {
  const { getAuthHeaders } = useAuth();

  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({
      name,
      namespace,
    }: {
      name: string;
      namespace?: string;
    }) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ name, namespace }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete conversation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
