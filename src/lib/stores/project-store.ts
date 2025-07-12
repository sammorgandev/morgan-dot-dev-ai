import { create } from "zustand";

interface ProjectState {
  // Project state
  currentProjectId: string | null;
  demoUrl: string | null;
  prompt: string;

  // Project actions
  setCurrentProjectId: (projectId: string | null) => void;
  setDemoUrl: (demoUrl: string | null) => void;
  setPrompt: (prompt: string) => void;
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
