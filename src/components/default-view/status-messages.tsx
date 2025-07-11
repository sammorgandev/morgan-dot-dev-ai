import { Card } from "@/components/ui/card";
import type { ActionState } from "@/lib/types";

interface StatusMessagesProps {
  actionState: ActionState;
  showDemo: boolean;
}

export function StatusMessages({ actionState, showDemo }: StatusMessagesProps) {
  if (!actionState) return null;

  return (
    <>
      {/* Error Display */}
      {actionState.error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <div className="text-red-600 dark:text-red-400 text-sm">
              <strong>Oops!</strong> {actionState.error}
            </div>
          </div>
        </Card>
      )}

      {/* Success Message */}
      {actionState.success && !showDemo && (
        <Card className="p-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm">
            <strong>Success!</strong> Site customization generated successfully.
          </div>
        </Card>
      )}
    </>
  );
}
