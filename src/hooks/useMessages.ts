"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { Message } from "@/lib/store";

export function useMessages(conversationId: string | null) {
  const { getAuthHeaders } = useAuth();

  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await fetch(`/api/conversations/${conversationId}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return (data.messages || []).map((msg: Record<string, unknown>) => ({
        ...msg,
        sources: msg.sources ? JSON.parse(msg.sources as string) : undefined,
      }));
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ conversationId, message }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
