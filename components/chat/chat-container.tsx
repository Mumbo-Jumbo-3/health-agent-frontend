"use client";

import { useConversations } from "@/hooks/use-conversations";
import { useChat } from "@/hooks/use-chat";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

export function ChatContainer() {
  const { activeConversation } = useConversations();
  const { sendMessage, isStreaming, stopStreaming } = useChat();

  if (!activeConversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-950">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Welcome to Health Agent</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start a new conversation to ask about health and wellness topics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatMessages
        messages={activeConversation.messages}
        isStreaming={isStreaming}
      />
      <ChatInput
        onSend={sendMessage}
        isStreaming={isStreaming}
        onStop={stopStreaming}
      />
    </div>
  );
}
