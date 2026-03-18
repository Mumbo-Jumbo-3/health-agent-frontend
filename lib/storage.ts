import { ConversationsState } from "./types";

const STORAGE_KEY = "health-agent-conversations";

const defaultState: ConversationsState = {
  conversations: [],
  activeConversationId: null,
};

export function loadConversations(): ConversationsState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return JSON.parse(raw) as ConversationsState;
  } catch {
    return defaultState;
  }
}

export function saveConversations(state: ConversationsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}
