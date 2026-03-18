export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  sessionId: string | null;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

export type ConversationsAction =
  | { type: "ADD_CONVERSATION"; conversation: Conversation }
  | { type: "DELETE_CONVERSATION"; id: string }
  | { type: "SET_ACTIVE"; id: string | null }
  | { type: "ADD_MESSAGE"; conversationId: string; message: Message }
  | { type: "APPEND_TO_LAST_MESSAGE"; conversationId: string; content: string }
  | { type: "UPDATE_SESSION_ID"; conversationId: string; sessionId: string }
  | { type: "LOAD"; state: ConversationsState };
