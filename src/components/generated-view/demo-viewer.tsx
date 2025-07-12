import { RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { FileViewer } from "./file-viewer";
import { DemoControls } from "./demo-controls";
import { IframeRenderer } from "./iframe-renderer";
import { useUnifiedActions } from "@/hooks/useUnifiedActions";
import { handleErrorRecovery, continueChat } from "@/app/actions";
import { ChatMessage } from "@/lib/types";

interface ActionResult {
  success?: boolean;
  data?: {
    demo?: string;
    messages?: ChatMessage[];
  };
}

export function DemoViewer() {
  const {
    demoUrl,
    isFullscreen,
    showDemo,
    showFiles,
    currentProjectId,
    setDemoUrl,
    setChatLoading,
    addMessage,
    setIsContinuing,
    chat,
    iframeError,
  } = useAppStore();

  const { executeAction, isActionProcessing } = useUnifiedActions();

  // Handle automatic error recovery
  const handleAutoRecovery = async () => {
    if (!iframeError || !chat.currentChatId || !currentProjectId) {
      return;
    }

    await executeAction({
      id: "error-recovery",
      execute: async () => {
        const formData = new FormData();
        formData.append("errorMessage", iframeError.message);
        formData.append("chatId", chat.currentChatId!);
        formData.append("projectId", currentProjectId);

        return await handleErrorRecovery(null, formData);
      },
      onSuccess: (result: unknown) => {
        const typedResult = result as ActionResult;
        if (typedResult?.success && typedResult.data?.demo) {
          setDemoUrl(typedResult.data.demo);
          if (typedResult.data.messages) {
            typedResult.data.messages.forEach((msg) => addMessage(msg));
          }
        }
      },
      onError: (error) => {
        console.error("Error recovery failed:", error);
      },
    });
  };

  // Handle follow-up message submission
  const handleFollowUpSubmit = async (message: string) => {
    if (!message.trim() || !chat.currentChatId || !currentProjectId) {
      return;
    }

    // Add optimistic user message
    const userMessage = {
      id: `user_${Date.now()}`,
      role: "user" as const,
      content: message.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsContinuing(true);
    setChatLoading(true);

    await executeAction({
      id: "continue-chat",
      execute: async () => {
        const formData = new FormData();
        formData.append("message", message.trim());
        formData.append("chatId", chat.currentChatId!);
        formData.append("projectId", currentProjectId);

        return await continueChat(null, formData);
      },
      onSuccess: (result: unknown) => {
        const typedResult = result as ActionResult;
        if (typedResult?.success && typedResult.data) {
          if (typedResult.data.demo && typedResult.data.demo !== demoUrl) {
            setDemoUrl(typedResult.data.demo);
          }
          if (typedResult.data.messages) {
            const assistantMessage = typedResult.data.messages.find(
              (msg) => msg.role === "assistant"
            );
            if (assistantMessage) {
              addMessage(assistantMessage);
            }
          }
        }
        setIsContinuing(false);
        setChatLoading(false);
      },
      onError: (error) => {
        console.error("Continue chat failed:", error);
        setIsContinuing(false);
        setChatLoading(false);
      },
    });
  };

  if (!showDemo || !demoUrl) {
    return null;
  }

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background"
          : "min-h-screen bg-gradient-to-br from-background to-muted/20"
      }`}
    >
      {/* Demo Controls */}
      <DemoControls
        onFollowUpSubmit={handleFollowUpSubmit}
        isProcessing={isActionProcessing("continue-chat")}
      />

      {/* Content Area - Demo Iframe or File Viewer */}
      <div className={`${isFullscreen ? "h-full" : "h-screen p-4 pt-16"}`}>
        {showFiles && currentProjectId ? (
          <div className="w-full h-full border-0 rounded-lg shadow-2xl bg-background">
            <FileViewer projectId={currentProjectId} />
          </div>
        ) : (
          <>
            {/* Subtle loading overlay for follow-up messages */}
            {isActionProcessing("continue-chat") && (
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 border z-10">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-muted-foreground">Updating...</span>
                </div>
              </div>
            )}

            <IframeRenderer
              url={demoUrl}
              onErrorRecovery={handleAutoRecovery}
              isRecovering={isActionProcessing("error-recovery")}
            />
          </>
        )}
      </div>
    </div>
  );
}
