"use client";
import { useRef, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Code } from "lucide-react";
import { useIframeState } from "@/hooks/useIframeState";
import { useAppStore } from "@/lib/store";

interface IframeRendererProps {
  url: string | null;
  onErrorRecovery: () => void;
  isRecovering: boolean;
}

export const IframeRenderer = memo(
  ({ url, onErrorRecovery, isRecovering }: IframeRendererProps) => {
    const { currentProjectId, toggleView } = useAppStore();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const {
      isLoaded,
      error,
      retryCount,
      maxRetryAttempts,
      canRetry,
      handleLoad,
      handleError,
      handleRetry,
      forceLoad,
    } = useIframeState(url);

    // Handle iframe events
    const handleIframeLoad = () => {
      handleLoad();

      // Try to detect runtime errors in iframe content
      // Note: This will fail for cross-origin iframes due to security restrictions
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.addEventListener("error", (event) => {
            handleError({
              type: "runtime_error",
              message:
                event.error?.message || "Runtime error in generated code",
              url: url || undefined,
              timestamp: new Date(),
            });
          });

          iframe.contentWindow.addEventListener(
            "unhandledrejection",
            (event) => {
              handleError({
                type: "runtime_error",
                message: event.reason?.message || "Unhandled promise rejection",
                url: url || undefined,
                timestamp: new Date(),
              });
            }
          );
        }
      } catch {
        // Expected for cross-origin iframes - this is normal browser security behavior
        console.debug(
          "Cross-origin iframe detected - runtime error detection not available"
        );
      }
    };

    const handleIframeError = () => {
      handleError({
        type: "load_error",
        message: "Failed to load the generated site",
        url: url || undefined,
        timestamp: new Date(),
      });
    };

    const handleManualRetry = async () => {
      const success = await handleRetry();
      if (success && iframeRef.current && url) {
        // Force iframe reload with cache busting
        iframeRef.current.src = url + "?retry=" + Date.now();
      }
    };

    // Update iframe src when URL changes
    useEffect(() => {
      if (iframeRef.current && url) {
        iframeRef.current.src = url;
      }
    }, [url]);

    if (!url) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>No demo URL available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full border-0 rounded-lg shadow-2xl bg-background relative">
        {/* Loading indicator */}
        {!isLoaded && !error && (
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
                onClick={forceLoad}
                className="mt-4"
              >
                Show Site Anyway
              </Button>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-10">
            <div className="text-center space-y-6 max-w-md mx-auto p-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Site Error Detected</h3>
                <p className="text-muted-foreground text-sm">{error.message}</p>
                {error.type === "runtime_error" && (
                  <p className="text-xs text-muted-foreground">
                    This appears to be a code issue that can be automatically
                    fixed.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {/* Auto-recovery button for runtime errors */}
                {error.type === "runtime_error" && (
                  <Button
                    onClick={onErrorRecovery}
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
                  onClick={handleManualRetry}
                  variant="outline"
                  disabled={!canRetry}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again{" "}
                  {retryCount > 0 && `(${retryCount}/${maxRetryAttempts})`}
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
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0 rounded-lg"
          title="Generated Site Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-top-navigation-by-user-activation"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="lazy"
        />
      </div>
    );
  }
);

IframeRenderer.displayName = "IframeRenderer";
