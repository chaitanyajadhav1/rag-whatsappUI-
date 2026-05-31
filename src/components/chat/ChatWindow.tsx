"use client";

import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useConversations } from "@/hooks/useConversations";
import { useDocuments } from "@/hooks/useDocuments";
import { useAppStore, Conversation } from "@/lib/store";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ChatDocuments from "./ChatDocuments";
import EmptyChat from "./EmptyChat";

interface ChatWindowProps {
  onOpenUpload?: () => void;
}

export default function ChatWindow({ onOpenUpload }: ChatWindowProps) {
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const isSending = useAppStore((s) => s.isSending);
  const setIsSending = useAppStore((s) => s.setIsSending);
  const setSidebarView = useAppStore((s) => s.setSidebarView);

  const { data: conversations } = useConversations();
  const { data: messages = [] } = useMessages(activeConversationId);
  const sendMessage = useSendMessage();

  const activeConversation = conversations?.find(
    (c: Conversation) => c.id === activeConversationId
  );

  // Fetch documents for this conversation's namespace
  const { data: allDocuments = [] } = useDocuments();
  const namespaceDocs = activeConversation
    ? allDocuments.filter((d) => d.namespace === activeConversation.namespace)
    : [];

  if (!activeConversation) {
    return <EmptyChat />;
  }

  const handleSend = async (text: string) => {
    setIsSending(true);
    try {
      await sendMessage.mutateAsync({
        conversationId: activeConversation.id,
        message: text,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-chat)" }}
    >
      <ChatHeader
        conversation={activeConversation}
        onViewDocs={() => setSidebarView("documents")}
      />
      <MessageList messages={messages} isTyping={isSending} />
      <ChatDocuments documents={namespaceDocs} />
      <ChatInput
        onSend={handleSend}
        onAttach={onOpenUpload}
        disabled={isSending}
      />
    </div>
  );
}

