"use client";

import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Conversation {
  id: string;
  name: string;
  namespace: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    content: string;
    metadata: Record<string, unknown>;
  }>;
  conversationId: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  namespace: string;
  status: "pending" | "processing" | "indexed" | "error";
  errorMsg?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;

  // Conversations
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;

  // UI State
  isSending: boolean;
  setIsSending: (v: boolean) => void;
  isTyping: boolean;
  setIsTyping: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Sidebar
  sidebarView: "chats" | "documents";
  setSidebarView: (v: "chats" | "documents") => void;

  // Mobile
  showSidebar: boolean;
  setShowSidebar: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null });
  },

  // Conversations
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),

  // UI State
  isSending: false,
  setIsSending: (v) => set({ isSending: v }),
  isTyping: false,
  setIsTyping: (v) => set({ isTyping: v }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  // Sidebar
  sidebarView: "chats",
  setSidebarView: (v) => set({ sidebarView: v }),

  // Mobile
  showSidebar: true,
  setShowSidebar: (v) => set({ showSidebar: v }),
}));
