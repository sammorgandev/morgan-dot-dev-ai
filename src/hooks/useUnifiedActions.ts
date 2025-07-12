"use client";
import { useState, useCallback, useRef } from "react";

interface ActionRequest {
  id: string;
  execute: () => Promise<unknown>;
  onSuccess?: (result: unknown) => void;
  onError?: (error: string) => void;
}

interface ActionState {
  isProcessing: boolean;
  currentAction: string | null;
  error: string | null;
  lastResult: unknown;
}

export const useUnifiedActions = () => {
  const [state, setState] = useState<ActionState>({
    isProcessing: false,
    currentAction: null,
    error: null,
    lastResult: null,
  });

  const actionQueueRef = useRef<ActionRequest[]>([]);

  const executeAction = useCallback(
    async (action: ActionRequest) => {
      // If currently processing, queue the action
      if (state.isProcessing) {
        actionQueueRef.current.push(action);
        return;
      }

      setState((prev) => ({
        ...prev,
        isProcessing: true,
        currentAction: action.id,
        error: null,
      }));

      try {
        const result = await action.execute();

        setState((prev) => ({
          ...prev,
          lastResult: result,
          error: null,
        }));

        action.onSuccess?.(result);

        // Process next action in queue
        if (actionQueueRef.current.length > 0) {
          const nextAction = actionQueueRef.current.shift();
          if (nextAction) {
            setTimeout(() => executeAction(nextAction), 0);
          }
        } else {
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            currentAction: null,
          }));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        setState((prev) => ({
          ...prev,
          isProcessing: false,
          currentAction: null,
          error: errorMessage,
        }));

        action.onError?.(errorMessage);
      }
    },
    [state.isProcessing]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const isActionProcessing = useCallback(
    (actionId: string) => {
      return state.isProcessing && state.currentAction === actionId;
    },
    [state.isProcessing, state.currentAction]
  );

  return {
    state,
    executeAction,
    clearError,
    isActionProcessing,
  };
};
