import { create } from "zustand";

interface ProjectState {
  // Project state
  currentProjectId: string | null;
  demoUrl: string | null;
  prompt: string;

  // Project actions
  setCurrentProjectId: (_projectId: string | null) => void;
  setDemoUrl: (_demoUrl: string | null) => void;
  setPrompt: (_prompt: string) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  // Initial state
  currentProjectId: null,
  demoUrl: null,
  prompt: "",

  // Actions
  setCurrentProjectId: (projectId: string | null) =>
    set({ currentProjectId: projectId }),

  setDemoUrl: (demoUrl: string | null) => set({ demoUrl }),

  setPrompt: (prompt: string) => set({ prompt }),

  resetProject: () =>
    set({
      currentProjectId: null,
      demoUrl: null,
      prompt: "",
    }),
}));
