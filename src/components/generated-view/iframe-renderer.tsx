"use client";
import { useRef, useEffect, memo, useCallback } from "react";
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
    const errorDetectionRef = useRef<NodeJS.Timeout | null>(null);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const autoRecoveryTriggeredRef = useRef(false);

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

    // Enhanced error detection with more aggressive monitoring
    const checkForCommonErrors = useCallback(() => {
      if (!url) return;

      // Reset auto-recovery flag for new URL
      autoRecoveryTriggeredRef.current = false;

      // Monitor console errors (works even for cross-origin)
      const originalConsoleError = console.error;
      const errorBuffer: string[] = [];
      let errorTimeout: NodeJS.Timeout;

      console.error = (...args) => {
        const errorMessage = args.join(" ");

        // Detect common v0 site errors - more comprehensive list
        if (
          errorMessage.includes("CORS") ||
          errorMessage.includes("Access-Control-Allow-Origin") ||
          errorMessage.includes("Failed to load") ||
          errorMessage.includes("fonts.googleapis.com") ||
          errorMessage.includes("esm.v0.dev") ||
          errorMessage.includes("FatalRendererError") ||
          errorMessage.includes("Unsupported Content-Type") ||
          errorMessage.includes(
            "Modules must be served with a valid MIME type"
          ) ||
          errorMessage.includes("net::ERR_") ||
          errorMessage.includes("ChunkLoadError") ||
          errorMessage.includes("Loading chunk") ||
          errorMessage.includes("SyntaxError") ||
          errorMessage.includes("ReferenceError") ||
          errorMessage.includes("TypeError") ||
          errorMessage.includes("Module not found") ||
          errorMessage.includes("Cannot resolve module") ||
          errorMessage.includes("Unexpected token")
        ) {
          errorBuffer.push(errorMessage);

          // Clear existing timeout
          if (errorTimeout) {
            clearTimeout(errorTimeout);
          }

          // Set a shorter delay to trigger recovery faster
          errorTimeout = setTimeout(() => {
            const combinedError = errorBuffer.join("\n");
            handleError({
              type: "runtime_error",
              message: combinedError,
              url: url,
              timestamp: new Date(),
            });

            // Auto-trigger error recovery for critical errors - be more aggressive
            if (
              !autoRecoveryTriggeredRef.current &&
              (combinedError.includes("FatalRendererError") ||
                combinedError.includes("Failed to load global configs") ||
                combinedError.includes("ChunkLoadError") ||
                combinedError.includes("Loading chunk") ||
                combinedError.includes("Module not found") ||
                combinedError.includes("Cannot resolve module") ||
                combinedError.includes("net::ERR_") ||
                (combinedError.includes("CORS") &&
                  combinedError.includes("fonts.googleapis.com")) ||
                combinedError.includes("Unsupported Content-Type"))
            ) {
              autoRecoveryTriggeredRef.current = true;
              console.log(
                "🔧 Auto-triggering error recovery due to critical errors:",
                combinedError
              );
              // Trigger recovery immediately for critical errors
              setTimeout(() => {
                onErrorRecovery();
              }, 500);
            }
          }, 1000); // Reduced from 2 seconds to 1 second
        }

        originalConsoleError(...args);
      };

      // Store reference for cleanup
      errorDetectionRef.current = setTimeout(() => {
        console.error = originalConsoleError;
        if (errorTimeout) {
          clearTimeout(errorTimeout);
        }
      }, 20000); // Reduced from 30 to 20 seconds
    }, [url, handleError, onErrorRecovery]);

    // Handle iframe events
    const handleIframeLoad = () => {
      handleLoad();

      // Clear load timeout since iframe loaded successfully
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }

      // Try to detect runtime errors in iframe content
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

            // Auto-trigger recovery for runtime errors
            if (!autoRecoveryTriggeredRef.current) {
              autoRecoveryTriggeredRef.current = true;
              setTimeout(() => {
                onErrorRecovery();
              }, 1000);
            }
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

              // Auto-trigger recovery for promise rejections
              if (!autoRecoveryTriggeredRef.current) {
                autoRecoveryTriggeredRef.current = true;
                setTimeout(() => {
                  onErrorRecovery();
                }, 1000);
              }
            }
          );
        }
      } catch {
        // Expected for cross-origin iframes - this is normal browser security behavior
        console.debug(
          "Cross-origin iframe detected - using alternative error detection methods"
        );
      }

      // Additional check: inspect iframe for common error indicators
      setTimeout(() => {
        try {
          const iframe = iframeRef.current;
          if (iframe && iframe.contentDocument) {
            const doc = iframe.contentDocument;
            const body = doc.body;

            // Check for common error page indicators
            if (
              body &&
              (body.textContent?.includes("Application error") ||
                body.textContent?.includes("Runtime Error") ||
                body.textContent?.includes("500") ||
                body.textContent?.includes("502") ||
                body.textContent?.includes("503") ||
                body.textContent?.includes("504") ||
                doc.title?.includes("Error") ||
                doc.querySelector(".error") ||
                doc.querySelector("#error") ||
                doc.querySelector("[data-error]"))
            ) {
              handleError({
                type: "runtime_error",
                message: "Site appears to have a runtime error or server error",
                ...(url && { url }),
                timestamp: new Date(),
              });

              if (!autoRecoveryTriggeredRef.current) {
                autoRecoveryTriggeredRef.current = true;
                setTimeout(() => {
                  onErrorRecovery();
                }, 2000);
              }
            }
          }
        } catch {
          // Ignore cross-origin errors
        }
      }, 3000); // Check 3 seconds after load
    };

    // Handle iframe load failures
    const handleIframeError = () => {
      handleError({
        type: "load_error",
        message: "Failed to load the generated site",
        url: url || undefined,
        timestamp: new Date(),
      });

      // Auto-trigger recovery for load errors
      if (!autoRecoveryTriggeredRef.current) {
        autoRecoveryTriggeredRef.current = true;
        setTimeout(() => {
          onErrorRecovery();
        }, 2000);
      }
    };

    // Aggressive timeout-based error detection for stuck loads
    useEffect(() => {
      if (!url || isLoaded || error) return;

      // Clear any existing timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      loadTimeoutRef.current = setTimeout(() => {
        // Check if iframe is still loading after 8 seconds
        const iframe = iframeRef.current;
        if (iframe && !isLoaded) {
          console.log("🚨 Load timeout detected, triggering error detection");

          // Try to detect if there are console errors indicating issues
          checkForCommonErrors();

          // Set a timeout error
          handleError({
            type: "runtime_error",
            message:
              "Site appears to have loading issues. This may be due to CORS errors, missing resources, or module loading failures.",
            url: url,
            timestamp: new Date(),
          });

          // Auto-trigger error recovery for timeout errors
          if (!autoRecoveryTriggeredRef.current) {
            autoRecoveryTriggeredRef.current = true;
            setTimeout(() => {
              console.log(
                "🔧 Auto-triggering error recovery due to load timeout"
              );
              onErrorRecovery();
            }, 1000);
          }
        }
      }, 8000); // Reduced from 10 to 8 seconds for faster recovery

      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      };
    }, [
      url,
      isLoaded,
      error,
      checkForCommonErrors,
      handleError,
      onErrorRecovery,
    ]);

    const handleManualRetry = async () => {
      const success = await handleRetry();
      if (success && iframeRef.current && url) {
        // Force iframe reload with cache busting
        iframeRef.current.src = url + "?retry=" + Date.now();
      }
    };

    // Update iframe src when URL changes and start error monitoring
    useEffect(() => {
      // Clean up previous monitoring
      if (errorDetectionRef.current) {
        clearTimeout(errorDetectionRef.current);
        errorDetectionRef.current = null;
      }

      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }

      // Reset auto-recovery flag for new URL
      autoRecoveryTriggeredRef.current = false;

      if (iframeRef.current && url) {
        iframeRef.current.src = url;
      }

      // Start monitoring for errors immediately when URL changes
      if (url) {
        checkForCommonErrors();
      }

      return () => {
        // Cleanup on unmount or URL change
        if (errorDetectionRef.current) {
          clearTimeout(errorDetectionRef.current);
        }
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    }, [url, checkForCommonErrors]);

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

        {/* Recovery progress indicator */}
        {isRecovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-20">
            <div className="text-center space-y-6 max-w-md mx-auto p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Auto-Fixing Issue</h3>
                <p className="text-muted-foreground text-sm">
                  The system detected runtime errors and is automatically
                  working to fix them...
                </p>
                <p className="text-xs text-muted-foreground">
                  This typically resolves within 30-60 seconds
                </p>
              </div>

              <div className="w-full bg-primary/20 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
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
                    {isRecovering
                      ? "The system is automatically working to fix this issue..."
                      : "This appears to be a code issue that can be automatically fixed."}
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
                  disabled={!canRetry || isRecovering}
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
                    disabled={isRecovering}
                  >
                    <Code className="w-4 w-4 mr-2" />
                    View Code Instead
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual error reporting for when automatic detection fails */}
        {!error && isLoaded && (
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!autoRecoveryTriggeredRef.current) {
                  autoRecoveryTriggeredRef.current = true;
                  handleError({
                    type: "runtime_error",
                    message:
                      "Site appears to have issues loading correctly. Common causes include CORS errors, missing fonts, or failed resource loads.",
                    ...(url && { url }),
                    timestamp: new Date(),
                  });
                  // Auto-trigger recovery for manual reports
                  setTimeout(() => {
                    onErrorRecovery();
                  }, 1000);
                }
              }}
              className="text-xs opacity-75 hover:opacity-100"
            >
              <AlertCircle className="w-3 h-3 mr-2" />
              Report Issues
            </Button>
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
