"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/use-conversations";
import { Conversation } from "@/lib/types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) {
  const { dispatch } = useConversations();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
        isActive
          ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
          : "hover:bg-muted"
      )}
    >
      <div className="flex-1 truncate">
        <p className="truncate font-medium">{conversation.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {new Date(conversation.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "DELETE_CONVERSATION", id: conversation.id });
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
