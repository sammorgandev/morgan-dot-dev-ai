import { create } from "zustand";
import {
  ChatMessage,
  ChatState,
  IframeError,
  ErrorRecoveryOptions,
} from "./types";

interface AppState {
  // Form state
  prompt: string;

  // UI state
  isFullscreen: boolean;
  showDemo: boolean;
  demoUrl: string | null;

  // File viewing state
  showFiles: boolean;
  currentProjectId: string | null;

  // Enhanced chat state
  chat: ChatState;
  iframeError: IframeError | null;
  isContinuing: boolean;
  followUpInput: string;

  // Actions
  setPrompt: (prompt: string) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setShowDemo: (showDemo: boolean) => void;
  setDemoUrl: (demoUrl: string | null) => void;
  setShowFiles: (showFiles: boolean) => void;
  setCurrentProjectId: (projectId: string | null) => void;
  toggleFullscreen: () => void;
  toggleView: () => void;
  closeDemo: () => void;
  resetForm: () => void;

  // Enhanced chat actions
  setChatId: (chatId: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  setChatLoading: (loading: boolean) => void;
  setChatError: (error: string | null) => void;
  setIframeError: (error: IframeError | null) => void;
  setIsContinuing: (continuing: boolean) => void;
  setFollowUpInput: (input: string) => void;
  clearChat: () => void;
  initializeChat: (chatId: string, messages?: ChatMessage[]) => void;

  // Error recovery actions
  triggerErrorRecovery: (options?: ErrorRecoveryOptions) => void;
  clearIframeError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  prompt: "",
  isFullscreen: false,
  showDemo: false,
  demoUrl: null,
  showFiles: false,
  currentProjectId: null,

  // Enhanced chat initial state
  chat: {
    messages: [],
    isLoading: false,
    error: null,
    currentChatId: null,
  },
  iframeError: null,
  isContinuing: false,
  followUpInput: "",

  // Actions
  setPrompt: (prompt: string) => set({ prompt }),

  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),

  setShowDemo: (showDemo: boolean) => set({ showDemo }),

  setDemoUrl: (demoUrl: string | null) => set({ demoUrl }),

  setShowFiles: (showFiles: boolean) => set({ showFiles }),

  setCurrentProjectId: (projectId: string | null) =>
    set({ currentProjectId: projectId }),

  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  toggleView: () => set((state) => ({ showFiles: !state.showFiles })),

  closeDemo: () =>
    set({
      showDemo: false,
      isFullscreen: false,
      demoUrl: null,
      showFiles: false,
      currentProjectId: null,
      // Reset chat state when closing demo
      chat: {
        messages: [],
        isLoading: false,
        error: null,
        currentChatId: null,
      },
      iframeError: null,
      isContinuing: false,
      followUpInput: "",
    }),

  resetForm: () => {
    set({
      prompt: "",
      showDemo: false,
      isFullscreen: false,
      demoUrl: null,
      showFiles: false,
      currentProjectId: null,
      chat: {
        messages: [],
        isLoading: false,
        error: null,
        currentChatId: null,
      },
      iframeError: null,
      isContinuing: false,
      followUpInput: "",
    });
  },

  // Enhanced chat actions
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

  initializeChat: (chatId: string, messages: ChatMessage[] = []) =>
    set({
      chat: {
        messages,
        isLoading: false,
        error: null,
        currentChatId: chatId,
      },
    }),

  // Error recovery actions
  triggerErrorRecovery: (options: ErrorRecoveryOptions = {}) => {
    const state = get();
    if (!state.iframeError || !state.chat.currentChatId) return;

    // Create error recovery message
    const errorMessage: ChatMessage = {
      id: `error_recovery_${Date.now()}`,
      role: "user",
      content: `The code returns the following error:\n\n${state.iframeError.message}\n\nRevise the code to address the error.`,
      timestamp: new Date(),
      metadata: {
        isError: true,
        errorDetails: state.iframeError.message,
        originalPrompt: options.includeOriginalPrompt
          ? state.prompt
          : undefined,
      },
    };

    // Add error recovery message and trigger continuation
    set((state) => ({
      chat: {
        ...state.chat,
        messages: [...state.chat.messages, errorMessage],
      },
      iframeError: null, // Clear the error since we're handling it
      isContinuing: true,
    }));
  },

  clearIframeError: () => set({ iframeError: null }),
}));
