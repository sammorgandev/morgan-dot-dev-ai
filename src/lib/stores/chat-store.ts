import { create } from "zustand";
import { ChatMessage, ChatState, IframeError } from "@/lib/types";

interface ChatStoreState {
  // Chat state
  chat: ChatState;
  iframeError: IframeError | null;
  isContinuing: boolean;
  followUpInput: string;

  // Chat actions
  setChatId: (chatId: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  setChatLoading: (loading: boolean) => void;
  setChatError: (error: string | null) => void;
  setIframeError: (error: IframeError | null) => void;
  setIsContinuing: (continuing: boolean) => void;
  setFollowUpInput: (input: string) => void;
  clearChat: () => void;
  clearIframeError: () => void;
  initializeChat: (chatId: string, messages?: ChatMessage[]) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  // Initial state
  chat: {
    messages: [],
    isLoading: false,
    error: null,
    currentChatId: null,
  },
  iframeError: null,
  isContinuing: false,
  followUpInput: "",

  // Chat actions
  setChatId: (chatId: string) =>
    set((state) => ({
      chat: { ...state.chat, currentChatId: chatId },
    })),

  addMessage: (message: ChatMessage) =>
    set((state) => ({
      chat: {
        ...state.chat,
        messages: [...state.chat.messages, message],
      },
    })),

  updateMessage: (messageId: string, updates: Partial<ChatMessage>) =>
    set((state) => ({
      chat: {
        ...state.chat,
        messages: state.chat.messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      },
    })),

  setChatLoading: (loading: boolean) =>
    set((state) => ({
      chat: { ...state.chat, isLoading: loading },
    })),

  setChatError: (error: string | null) =>
    set((state) => ({
      chat: { ...state.chat, error },
    })),

  setIframeError: (error: IframeError | null) => set({ iframeError: error }),

  setIsContinuing: (continuing: boolean) => set({ isContinuing: continuing }),

  setFollowUpInput: (input: string) => set({ followUpInput: input }),

  clearChat: () =>
    set({
      chat: {
        messages: [],
        isLoading: false,
        error: null,
        currentChatId: null,
      },
    }),

  clearIframeError: () => set({ iframeError: null }),

  initializeChat: (chatId: string, messages: ChatMessage[] = []) =>
    set({
      chat: {
        messages,
        isLoading: false,
        error: null,
        currentChatId: chatId,
      },
    }),
}));
