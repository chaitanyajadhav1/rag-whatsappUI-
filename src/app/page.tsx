"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import DocumentManager from "@/components/documents/DocumentManager";
import UploadDialog from "@/components/documents/UploadDialog";
import { useUploadDocument } from "@/hooks/useDocuments";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const sidebarView = useAppStore((s) => s.sidebarView);
  const showSidebar = useAppStore((s) => s.showSidebar);
  const setShowSidebar = useAppStore((s) => s.setShowSidebar);
  const activeConversationId = useAppStore((s) => s.activeConversationId);

  const [uploadOpen, setUploadOpen] = useState(false);
  const uploadDocument = useUploadDocument();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div
        className="h-dvh flex items-center justify-center"
        style={{ background: "var(--bg-app)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: "var(--accent)" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const handleUpload = async (files: File[], namespace: string) => {
    for (const file of files) {
      await uploadDocument.mutateAsync({ file, namespace });
    }
  };

  return (
    <div
      className="h-dvh flex overflow-hidden"
      style={{ background: "var(--bg-app)" }}
    >
      {/* Top green bar (WhatsApp Web style) */}
      <div
        className="fixed top-0 left-0 right-0 h-[128px] z-0"
        style={{ background: "var(--accent)" }}
      />

      {/* Main container */}
      <div className="relative z-10 flex w-full max-w-[1600px] mx-auto my-0 md:my-5 h-dvh md:h-[calc(100dvh-40px)] shadow-2xl rounded-none md:rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            ${showSidebar ? "flex" : "hidden"} md:flex
            flex-col w-full md:w-[420px] lg:w-[440px] shrink-0
            absolute md:relative inset-0 z-20 md:z-auto
            h-full max-h-dvh md:max-h-full overflow-hidden
          `}
          style={{ background: "var(--bg-sidebar)" }}
        >
          <ChatSidebar
            onViewDocuments={() => setShowSidebar(false)}
          />
        </div>

        {/* Main content */}
        <div
          className={`
            ${!showSidebar ? "flex" : "hidden"} md:flex
            flex-col flex-1 min-w-0
          `}
        >
          {sidebarView === "documents" ? (
            <DocumentManager />
          ) : (
            <ChatWindow onOpenUpload={() => setUploadOpen(true)} />
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
