"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { loadConversations, saveConversations } from "@/lib/storage";
import {
  Conversation,
  ConversationsAction,
  ConversationsState,
  Message,
} from "@/lib/types";

function conversationsReducer(
  state: ConversationsState,
  action: ConversationsAction
): ConversationsState {
  switch (action.type) {
    case "LOAD":
      return action.state;
    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        activeConversationId: action.conversation.id,
      };
    case "DELETE_CONVERSATION": {
      const filtered = state.conversations.filter((c) => c.id !== action.id);
      return {
        ...state,
        conversations: filtered,
        activeConversationId:
          state.activeConversationId === action.id
            ? filtered[0]?.id ?? null
            : state.activeConversationId,
      };
    }
    case "SET_ACTIVE":
      return { ...state, activeConversationId: action.id };
    case "ADD_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? {
                ...c,
                messages: [...c.messages, action.message],
                title:
                  c.messages.length === 0 && action.message.role === "user"
                    ? action.message.content.slice(0, 50)
                    : c.title,
                updatedAt: Date.now(),
              }
            : c
        ),
      };
    case "APPEND_TO_LAST_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          if (c.id !== action.conversationId) return c;
          const msgs = [...c.messages];
          const last = msgs[msgs.length - 1];
          if (last && last.role === "assistant") {
            msgs[msgs.length - 1] = {
              ...last,
              content: last.content + action.content,
            };
          }
          return { ...c, messages: msgs, updatedAt: Date.now() };
        }),
      };
    case "UPDATE_SESSION_ID":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, sessionId: action.sessionId }
            : c
        ),
      };
    default:
      return state;
  }
}

const defaultState: ConversationsState = {
  conversations: [],
  activeConversationId: null,
};

interface ConversationsContextValue {
  state: ConversationsState;
  dispatch: React.Dispatch<ConversationsAction>;
  activeConversation: Conversation | undefined;
  addMessage: (conversationId: string, message: Message) => void;
  appendToLastMessage: (conversationId: string, content: string) => void;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(
  null
);

export function ConversationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(conversationsReducer, defaultState);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const loaded = loadConversations();
      dispatch({ type: "LOAD", state: loaded });
    }
  }, []);

  useEffect(() => {
    if (initialized.current) {
      saveConversations(state);
    }
  }, [state]);

  const activeConversation = state.conversations.find(
    (c) => c.id === state.activeConversationId
  );

  const addMessage = useCallback(
    (conversationId: string, message: Message) => {
      dispatch({ type: "ADD_MESSAGE", conversationId, message });
    },
    []
  );

  const appendToLastMessage = useCallback(
    (conversationId: string, content: string) => {
      dispatch({ type: "APPEND_TO_LAST_MESSAGE", conversationId, content });
    },
    []
  );

  return (
    <ConversationsContext.Provider
      value={{ state, dispatch, activeConversation, addMessage, appendToLastMessage }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx)
    throw new Error(
      "useConversations must be used within ConversationsProvider"
    );
  return ctx;
}
