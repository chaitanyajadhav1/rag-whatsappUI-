"use client";

import { useState } from "react";
import {
  MessageSquarePlus,
  Search,
  FileText,
  MessageCircle,
  LogOut,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useConversations, useCreateConversation, useDeleteConversation } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import ConversationItem from "./ConversationItem";

interface ChatSidebarProps {
  onViewDocuments?: () => void;
}

export default function ChatSidebar({ onViewDocuments }: ChatSidebarProps) {
  const { user, logout } = useAuth();
  const {
    activeConversationId,
    setActiveConversation,
    searchQuery,
    setSearchQuery,
    sidebarView,
    setSidebarView,
    setShowSidebar,
  } = useAppStore();

  const { data: conversations = [] } = useConversations();
  const createConversation = useCreateConversation();
  const deleteConversation = useDeleteConversation();

  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [isDark, setIsDark] = useState(true);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;
    try {
      const conv = await createConversation.mutateAsync({
        name: newChatName.trim(),
        namespace: "default",
      });
      setActiveConversation(conv.id);
      setShowNewChat(false);
      setNewChatName("");
      setShowSidebar(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleDeleteChat = async (id: string) => {
    try {
      await deleteConversation.mutateAsync(id);
      if (activeConversationId === id) {
        setActiveConversation(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {user?.name || "User"}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
            title="Sign out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="flex shrink-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors"
          style={{
            color:
              sidebarView === "chats"
                ? "var(--accent)"
                : "var(--text-secondary)",
            borderBottom:
              sidebarView === "chats"
                ? "2px solid var(--accent)"
                : "2px solid transparent",
          }}
          onClick={() => setSidebarView("chats")}
        >
          <MessageCircle className="w-4 h-4" />
          Chats
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors"
          style={{
            color:
              sidebarView === "documents"
                ? "var(--accent)"
                : "var(--text-secondary)",
            borderBottom:
              sidebarView === "documents"
                ? "2px solid var(--accent)"
                : "2px solid transparent",
          }}
          onClick={() => {
            setSidebarView("documents");
            if (onViewDocuments) onViewDocuments();
          }}
        >
          <FileText className="w-4 h-4" />
          Documents
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "var(--bg-panel)" }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "var(--text-primary)" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
            </button>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div
          className="mx-3 mb-2 p-3 rounded-xl animate-[scale-in_0.2s_ease-out]"
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-color)",
          }}
        >
          <input
            type="text"
            placeholder="Chat name"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-3"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleCreateChat()}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewChat(false)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChat}
              disabled={!newChatName.trim()}
              className="flex-1 py-2 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50"
              style={{ background: "var(--accent)" }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MessageCircle
              className="w-12 h-12 mb-3"
              style={{ color: "var(--text-secondary)", opacity: 0.3 }}
            />
            <p
              className="text-sm text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              {searchQuery
                ? "No conversations match your search"
                : "No conversations yet"}
            </p>
          </div>
        )}
        {filteredConversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeConversationId}
            onClick={() => {
              setActiveConversation(conv.id);
              setShowSidebar(false);
            }}
            onDelete={() => handleDeleteChat(conv.id)}
          />
        ))}
      </div>

      {/* New Chat FAB */}
      <div className="p-3 shrink-0">
        <button
          onClick={() => setShowNewChat(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          <MessageSquarePlus className="w-4.5 h-4.5" />
          New Chat
        </button>
      </div>
    </div>
  );
}
