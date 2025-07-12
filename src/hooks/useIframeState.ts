import { useState, useEffect, useCallback, useRef } from "react";
import { IframeError } from "@/lib/types";

export const useIframeState = (url: string | null) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<IframeError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RETRY_ATTEMPTS = 2;
  const LOAD_TIMEOUT = 60000; // 60 seconds

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setError(null);
    setRetryCount(0);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleError = useCallback((iframeError: IframeError) => {
    setError(iframeError);
    setIsLoaded(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleRetry = useCallback(async () => {
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      return false;
    }

    setRetryCount((prev) => prev + 1);
    setError(null);
    setIsLoaded(false);

    // Wait a bit before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  }, [retryCount]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forceLoad = useCallback(() => {
    setIsLoaded(true);
    setError(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Set up load timeout when URL changes
  useEffect(() => {
    if (url && !isLoaded) {
      setIsLoaded(false);
      setError(null);

      // Set up load timeout
      timeoutRef.current = setTimeout(() => {
        handleError({
          type: "network_error",
          message: "Site took too long to load",
          url: url,
          timestamp: new Date(),
        });
      }, LOAD_TIMEOUT);
    }

    // Cleanup timeout on unmount or URL change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [url, isLoaded, handleError]);

  return {
    isLoaded,
    error,
    retryCount,
    maxRetryAttempts: MAX_RETRY_ATTEMPTS,
    canRetry: retryCount < MAX_RETRY_ATTEMPTS,
    handleLoad,
    handleError,
    handleRetry,
    clearError,
    forceLoad,
  };
};
