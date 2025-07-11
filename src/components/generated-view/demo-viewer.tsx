import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function DemoViewer() {
  const { actionState, isFullscreen, showDemo, closeDemo, toggleFullscreen } =
    useAppStore();

  if (!showDemo || !actionState?.success || !actionState.data?.demo) {
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
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
        <Button
          onClick={closeDemo}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          Back to Editor
        </Button>
        <div className="flex gap-2">
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

      {/* Demo Iframe */}
      <div className={`${isFullscreen ? "h-full" : "h-screen p-4 pt-16"}`}>
        <iframe
          src={actionState.data.demo}
          className="w-full h-full border-0 rounded-lg shadow-2xl"
          title="Generated Site Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
