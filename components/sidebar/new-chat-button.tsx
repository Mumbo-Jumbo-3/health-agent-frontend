"use client";

import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/use-conversations";

export function NewChatButton() {
  const { dispatch } = useConversations();

  function handleNew() {
    dispatch({
      type: "ADD_CONVERSATION",
      conversation: {
        id: crypto.randomUUID(),
        title: "New conversation",
        sessionId: null,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
  }

  return (
    <Button onClick={handleNew} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      New Chat
    </Button>
  );
}
