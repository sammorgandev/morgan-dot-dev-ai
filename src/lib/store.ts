import { create } from "zustand";

interface ActionState {
  success?: boolean;
  error?: string;
  data?: {
    demo?: string;
  };
}

interface AppState {
  // Form state
  prompt: string;
  actionState: ActionState | null;
  isPending: boolean;

  // UI state
  isFullscreen: boolean;
  showDemo: boolean;

  // Actions
  setPrompt: (prompt: string) => void;
  setActionState: (state: ActionState | null) => void;
  setIsPending: (isPending: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setShowDemo: (showDemo: boolean) => void;
  toggleFullscreen: () => void;
  closeDemo: () => void;
  handleSubmitSuccess: () => void;
  handleSubmitStart: () => void;
  handleSubmitEnd: () => void;
  resetForm: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  prompt: "",
  actionState: null,
  isPending: false,
  isFullscreen: false,
  showDemo: false,

  // Actions
  setPrompt: (prompt: string) => set({ prompt }),

  setActionState: (actionState: ActionState | null) => {
    set({ actionState, isPending: false });

    // Handle success state changes
    if (actionState?.success) {
      const { handleSubmitSuccess } = get();
      handleSubmitSuccess();
    }
  },

  setIsPending: (isPending: boolean) => set({ isPending }),

  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),

  setShowDemo: (showDemo: boolean) => set({ showDemo }),

  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  closeDemo: () => set({ showDemo: false, isFullscreen: false }),

  handleSubmitStart: () => set({ isPending: true, actionState: null }),

  handleSubmitEnd: () => set({ isPending: false }),

  handleSubmitSuccess: () => {
    set({
      prompt: "",
      showDemo: true,
      isFullscreen: true,
    });
  },

  resetForm: () => {
    set({
      prompt: "",
      actionState: null,
      isPending: false,
      showDemo: false,
      isFullscreen: false,
    });
  },
}));
