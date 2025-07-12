"use client";

// Backward compatibility layer - re-exports from domain-specific stores
// TODO: Gradually migrate components to use domain-specific stores directly
import { useUIStore } from "./stores/ui-store";
import { useChatStore } from "./stores/chat-store";
import { useProjectStore } from "./stores/project-store";
import { ErrorRecoveryOptions } from "./types";

// Create a combined store hook for backward compatibility
export const useAppStore = () => {
  const ui = useUIStore();
  const chat = useChatStore();
  const project = useProjectStore();

  return {
    // UI state
    isFullscreen: ui.isFullscreen,
    showDemo: ui.showDemo,
    showFiles: ui.showFiles,

    // Project state
    currentProjectId: project.currentProjectId,
    demoUrl: project.demoUrl,
    prompt: project.prompt,

    // Chat state
    chat: chat.chat,
    iframeError: chat.iframeError,
    isContinuing: chat.isContinuing,
    followUpInput: chat.followUpInput,

    // UI actions
    setIsFullscreen: ui.setIsFullscreen,
    setShowDemo: ui.setShowDemo,
    setShowFiles: ui.setShowFiles,
    toggleFullscreen: ui.toggleFullscreen,
    toggleView: ui.toggleView,
    closeDemo: () => {
      ui.closeDemo();
      chat.clearChat();
      chat.clearIframeError();
      chat.setIsContinuing(false);
      chat.setFollowUpInput("");
    },

    // Project actions
    setCurrentProjectId: project.setCurrentProjectId,
    setDemoUrl: project.setDemoUrl,
    setPrompt: project.setPrompt,
    resetForm: () => {
      project.resetProject();
      ui.closeDemo();
      chat.clearChat();
      chat.clearIframeError();
      chat.setIsContinuing(false);
      chat.setFollowUpInput("");
    },

    // Chat actions
    setChatId: chat.setChatId,
    addMessage: chat.addMessage,
    updateMessage: chat.updateMessage,
    setChatLoading: chat.setChatLoading,
    setChatError: chat.setChatError,
    setIframeError: chat.setIframeError,
    setIsContinuing: chat.setIsContinuing,
    setFollowUpInput: chat.setFollowUpInput,
    clearChat: chat.clearChat,
    initializeChat: chat.initializeChat,
    clearIframeError: chat.clearIframeError,

    // Error recovery actions
    triggerErrorRecovery: (options: ErrorRecoveryOptions = {}) => {
      const currentState = {
        iframeError: chat.iframeError,
        chatCurrentId: chat.chat.currentChatId,
        prompt: project.prompt,
      };

      if (!currentState.iframeError || !currentState.chatCurrentId) return;

      // Create error recovery message
      const errorMessage = {
        id: `error_recovery_${Date.now()}`,
        role: "user" as const,
        content: `The code returns the following error:\n\n${currentState.iframeError.message}\n\nRevise the code to address the error.`,
        timestamp: new Date(),
        metadata: {
          isError: true,
          errorDetails: currentState.iframeError.message,
          originalPrompt: options.includeOriginalPrompt
            ? currentState.prompt
            : undefined,
        },
      };

      // Add error recovery message and trigger continuation
      chat.addMessage(errorMessage);
      chat.setIframeError(null);
      chat.setIsContinuing(true);
    },
  };
};
