import { create } from "zustand";

interface UIState {
  // UI state
  isFullscreen: boolean;
  showDemo: boolean;
  showFiles: boolean;

  // UI actions
  setIsFullscreen: (isFullscreen: boolean) => void;
  setShowDemo: (showDemo: boolean) => void;
  setShowFiles: (showFiles: boolean) => void;
  toggleFullscreen: () => void;
  toggleView: () => void;
  closeDemo: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isFullscreen: false,
  showDemo: false,
  showFiles: false,

  // Actions
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setShowDemo: (showDemo: boolean) => set({ showDemo }),
  setShowFiles: (showFiles: boolean) => set({ showFiles }),

  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  toggleView: () => set((state) => ({ showFiles: !state.showFiles })),

  closeDemo: () =>
    set({
      showDemo: false,
      isFullscreen: false,
      showFiles: false,
    }),
}));
