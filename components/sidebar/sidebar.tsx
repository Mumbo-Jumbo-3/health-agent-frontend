"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useConversations } from "@/hooks/use-conversations";
import { NewChatButton } from "./new-chat-button";
import { ConversationItem } from "./conversation-item";

export function Sidebar() {
  const { state, dispatch } = useConversations();

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <NewChatButton />
      <Separator />
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {state.conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === state.activeConversationId}
              onSelect={() => dispatch({ type: "SET_ACTIVE", id: conv.id })}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
