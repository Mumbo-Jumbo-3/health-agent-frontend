"use client";

import { useCallback, useRef, useState } from "react";
import { streamChat } from "@/lib/api";
import { useConversations } from "./use-conversations";

export function useChat() {
  const { activeConversation, addMessage, appendToLastMessage, dispatch } =
    useConversations();
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeConversation || !content.trim() || isStreaming) return;

      const convId = activeConversation.id;

      addMessage(convId, {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      });

      const assistantMsgId = crypto.randomUUID();
      addMessage(convId, {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      });

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      await streamChat({
        message: content.trim(),
        sessionId: activeConversation.sessionId,
        signal: controller.signal,
        onToken(token) {
          appendToLastMessage(convId, token);
        },
        onDone(sessionId) {
          dispatch({
            type: "UPDATE_SESSION_ID",
            conversationId: convId,
            sessionId,
          });
        },
        onError(error) {
          appendToLastMessage(convId, `\n\n**Error:** ${error.message}`);
        },
      });

      setIsStreaming(false);
      abortRef.current = null;
    },
    [activeConversation, isStreaming, addMessage, appendToLastMessage, dispatch]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { sendMessage, isStreaming, stopStreaming };
}
