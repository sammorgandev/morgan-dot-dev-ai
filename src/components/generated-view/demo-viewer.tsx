import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Maximize2,
  Minimize2,
  Code,
  Monitor,
  AlertCircle,
  RefreshCw,
  Send,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { FileViewer } from "./file-viewer";
import { useState, useEffect, useRef, useCallback } from "react";
import { IframeError } from "@/lib/types";
import { handleErrorRecovery, continueChat } from "@/app/actions";
import { useActionState } from "react";

export function DemoViewer() {
  const {
    demoUrl,
    isFullscreen,
    showDemo,
    showFiles,
    currentProjectId,
    closeDemo,
    toggleFullscreen,
    toggleView,
    chat,
    iframeError,
    setIframeError,
    clearIframeError,
    followUpInput,
    setFollowUpInput,
    setIsContinuing,
    setDemoUrl,
    setChatLoading,
    addMessage,
  } = useAppStore();

  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Debug logging for iframe loading state
  useEffect(() => {
    console.log("📊 iframeLoaded state changed:", iframeLoaded);
  }, [iframeLoaded]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Error recovery action state
  const [errorRecoveryState, errorRecoveryAction, isRecovering] =
    useActionState(handleErrorRecovery, null);

  // Continue chat action state
  const [continueChatState, continueChatAction, isContinuingChat] =
    useActionState(continueChat, null);

  // Maximum retry attempts before giving up
  const MAX_RETRY_ATTEMPTS = 2;
  const LOAD_TIMEOUT = 60000; // 60 seconds - v0 preview sites can be slow

  // Handle iframe load success
  const handleIframeLoad = () => {
    console.log("🎉 Setting iframe as loaded");
    setIframeLoaded(true);
    setRetryCount(0);
    clearIframeError();

    // Clear load timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    // Try to detect runtime errors in iframe content
    // Note: This will fail for cross-origin iframes due to security restrictions
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // Check if we can access the iframe content (same-origin only)
        // This will throw for cross-origin iframes
        iframe.contentWindow.addEventListener("error", (event) => {
          handleIframeError({
            type: "runtime_error",
            message: event.error?.message || "Runtime error in generated code",
            url: demoUrl || undefined,
            timestamp: new Date(),
          });
        });

        // Listen for unhandled promise rejections
        iframe.contentWindow.addEventListener("unhandledrejection", (event) => {
          handleIframeError({
            type: "runtime_error",
            message: event.reason?.message || "Unhandled promise rejection",
            url: demoUrl || undefined,
            timestamp: new Date(),
          });
        });
      }
    } catch {
      // Expected for cross-origin iframes - this is normal browser security behavior
      // We can't access iframe content from different domains due to same-origin policy
      console.debug(
        "Cross-origin iframe detected - runtime error detection not available"
      );
    }
  };

  // Handle iframe load errors
  const handleIframeError = useCallback(
    (error: IframeError) => {
      console.error("Iframe error detected:", error);
      setIframeError(error);
      setIframeLoaded(false);

      // Clear load timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    },
    [setIframeError]
  );

  // Handle iframe load event
  const handleIframeLoadEvent = () => {
    console.log("✅ Iframe loaded successfully:", demoUrl);
    handleIframeLoad();
  };

  // Handle iframe error event
  const handleIframeErrorEvent = () => {
    console.log("❌ Iframe failed to load:", demoUrl);
    handleIframeError({
      type: "load_error",
      message: "Failed to load the generated site",
      url: demoUrl || undefined,
      timestamp: new Date(),
    });
  };

  // Set up load timeout when iframe src changes
  useEffect(() => {
    if (demoUrl && !showFiles) {
      setIframeLoaded(false);

      // Set up load timeout
      loadTimeoutRef.current = setTimeout(() => {
        handleIframeError({
          type: "network_error",
          message: "Site took too long to load",
          url: demoUrl,
          timestamp: new Date(),
        });
      }, LOAD_TIMEOUT);
    }

    // Cleanup timeout on unmount or URL change
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [demoUrl, showFiles, handleIframeError]);

  // Handle manual retry
  const handleRetry = async () => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      return;
    }

    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
    clearIframeError();

    // Wait a bit before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Force iframe reload
    if (iframeRef.current && demoUrl) {
      iframeRef.current.src = demoUrl + "?retry=" + Date.now();
    }

    setIsRetrying(false);
  };

  // Handle automatic error recovery
  const handleAutoRecovery = async () => {
    if (!iframeError || !chat.currentChatId || !currentProjectId) {
      return;
    }

    const formData = new FormData();
    formData.append("errorMessage", iframeError.message);
    formData.append("chatId", chat.currentChatId);
    formData.append("projectId", currentProjectId);

    errorRecoveryAction(formData);
  };

  // Handle follow-up message submission
  const handleFollowUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!followUpInput.trim() || !chat.currentChatId || !currentProjectId) {
      return;
    }

    // Add optimistic user message
    const userMessage = {
      id: `user_${Date.now()}`,
      role: "user" as const,
      content: followUpInput.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsContinuing(true);
    setChatLoading(true);

    const formData = new FormData();
    formData.append("message", followUpInput.trim());
    formData.append("chatId", chat.currentChatId);
    formData.append("projectId", currentProjectId);

    // Clear input immediately for better UX
    setFollowUpInput("");

    continueChatAction(formData);
  };

  // Handle successful error recovery
  useEffect(() => {
    if (errorRecoveryState?.success && errorRecoveryState.data?.demo) {
      // Clear the error and update the demo URL
      clearIframeError();
      setRetryCount(0);
      setDemoUrl(errorRecoveryState.data.demo);

      // Add assistant message
      if (errorRecoveryState.data.messages) {
        errorRecoveryState.data.messages.forEach((msg) => addMessage(msg));
      }
    }
  }, [errorRecoveryState, clearIframeError, setDemoUrl, addMessage]);

  // Handle successful chat continuation
  useEffect(() => {
    if (continueChatState?.success && continueChatState.data) {
      // Update demo URL if changed
      if (
        continueChatState.data.demo &&
        continueChatState.data.demo !== demoUrl
      ) {
        setDemoUrl(continueChatState.data.demo);
      }

      // Add assistant message
      if (continueChatState.data.messages) {
        const assistantMessage = continueChatState.data.messages.find(
          (msg) => msg.role === "assistant"
        );
        if (assistantMessage) {
          addMessage(assistantMessage);
        }
      }

      setIsContinuing(false);
      setChatLoading(false);
    } else if (continueChatState?.error) {
      setIsContinuing(false);
      setChatLoading(false);
    }
  }, [
    continueChatState,
    demoUrl,
    setDemoUrl,
    addMessage,
    setIsContinuing,
    setChatLoading,
  ]);

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
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button
          onClick={closeDemo}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          Back to Editor
        </Button>

        {/* Follow-up Input - Only show when not in error state and chat is available */}
        {!iframeError && chat.currentChatId && currentProjectId && (
          <form
            onSubmit={handleFollowUpSubmit}
            className="flex items-center gap-2 max-w-md"
          >
            <Input
              value={followUpInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFollowUpInput(e.target.value)
              }
              placeholder="Continue the conversation..."
              className="bg-background/80 backdrop-blur-sm border-muted-foreground/20"
              disabled={isContinuingChat || chat.isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={
                !followUpInput.trim() || isContinuingChat || chat.isLoading
              }
              className="bg-background/80 backdrop-blur-sm"
            >
              {isContinuingChat || chat.isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}

        <div className="flex gap-2">
          {currentProjectId && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleView}
              className="bg-background/80 backdrop-blur-sm"
            >
              {showFiles ? (
                <Monitor className="h-4 w-4" />
              ) : (
                <Code className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={closeDemo}
            className="bg-background/80 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area - Demo Iframe or File Viewer */}
      <div className={`${isFullscreen ? "h-full" : "h-screen p-4 pt-16"}`}>
        {showFiles && currentProjectId ? (
          <div className="w-full h-full border-0 rounded-lg shadow-2xl bg-background">
            <FileViewer projectId={currentProjectId} />
          </div>
        ) : (
          <div className="w-full h-full border-0 rounded-lg shadow-2xl bg-background relative">
            {/* Loading indicator */}
            {!iframeLoaded && !iframeError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="text-center space-y-4">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading your site...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    v0 preview sites can take up to 60 seconds to load
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("🔧 Manual override: showing site anyway");
                      setIframeLoaded(true);
                      clearIframeError();
                      // Clear timeout to prevent conflicts
                      if (loadTimeoutRef.current) {
                        clearTimeout(loadTimeoutRef.current);
                        loadTimeoutRef.current = null;
                      }
                    }}
                    className="mt-4"
                  >
                    Show Site Anyway
                  </Button>
                </div>
              </div>
            )}

            {/* Subtle loading overlay for follow-up messages */}
            {(isContinuingChat || chat.isLoading) && !iframeError && (
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 border z-10">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-muted-foreground">Updating...</span>
                </div>
              </div>
            )}

            {/* Error display */}
            {iframeError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-10">
                <div className="text-center space-y-6 max-w-md mx-auto p-6">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      Site Error Detected
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {iframeError.message}
                    </p>
                    {iframeError.type === "runtime_error" && (
                      <p className="text-xs text-muted-foreground">
                        This appears to be a code issue that can be
                        automatically fixed.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Auto-recovery button for runtime errors */}
                    {iframeError.type === "runtime_error" &&
                      chat.currentChatId && (
                        <Button
                          onClick={handleAutoRecovery}
                          disabled={isRecovering}
                          className="w-full"
                        >
                          {isRecovering ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Fixing Issue...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Auto-Fix Issue
                            </>
                          )}
                        </Button>
                      )}

                    {/* Manual retry button */}
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      disabled={isRetrying || retryCount >= MAX_RETRY_ATTEMPTS}
                      className="w-full"
                    >
                      {isRetrying ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again{" "}
                          {retryCount > 0 &&
                            `(${retryCount}/${MAX_RETRY_ATTEMPTS})`}
                        </>
                      )}
                    </Button>

                    {/* View files button */}
                    {currentProjectId && (
                      <Button
                        variant="outline"
                        onClick={toggleView}
                        className="w-full"
                      >
                        <Code className="w-4 w-4 mr-2" />
                        View Code Instead
                      </Button>
                    )}
                  </div>

                  {/* Recovery state feedback */}
                  {errorRecoveryState?.error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                      Auto-fix failed: {errorRecoveryState.error}
                    </div>
                  )}
                  {errorRecoveryState?.success && (
                    <div className="text-sm text-green-600 bg-green-100 p-3 rounded">
                      Issue fixed! The site should load correctly now.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Iframe */}
            <iframe
              ref={iframeRef}
              src={demoUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Generated Site Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-top-navigation-by-user-activation"
              onLoad={handleIframeLoadEvent}
              onError={handleIframeErrorEvent}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
