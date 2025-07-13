"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Maximize2,
  Minimize2,
  Code,
  Monitor,
  RefreshCw,
  Send,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

interface DemoControlsProps {
  onFollowUpSubmit: (message: string) => void;
  isProcessing: boolean;
  onPublish?: () => void;
  isPublished?: boolean;
  isDeployed?: boolean;
  deploymentUrl?: string;
  isDeploying?: boolean;
}

export function DemoControls({
  onFollowUpSubmit,
  isProcessing,
  onPublish,
  isPublished,
  isDeployed,
  deploymentUrl,
  isDeploying,
}: DemoControlsProps) {
  const {
    isFullscreen,
    showFiles,
    currentProjectId,
    closeDemo,
    toggleFullscreen,
    toggleView,
    chat,
    iframeError,
    followUpInput,
    setFollowUpInput,
  } = useAppStore();

  const [localInput, setLocalInput] = useState(followUpInput);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localInput.trim() || isProcessing) return;

    onFollowUpSubmit(localInput.trim());
    setLocalInput("");
    setFollowUpInput("");
  };

  return (
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
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-md"
        >
          <Input
            value={localInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocalInput(e.target.value)
            }
            placeholder="Continue the conversation..."
            className="bg-background/80 backdrop-blur-sm border-muted-foreground/20"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!localInput.trim() || isProcessing}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      )}

      <div className="flex gap-2">
        {/* Publish Button */}
        {onPublish && !isPublished && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPublish}
            className="bg-background/80 backdrop-blur-sm"
            disabled={isProcessing}
          >
            <Rocket className="h-4 w-4 mr-1" />
            Publish
          </Button>
        )}

        {/* Deployment Status */}
        {isDeploying && (
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            disabled
          >
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            Deploying...
          </Button>
        )}

        {/* Deployed Link */}
        {isDeployed && deploymentUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(deploymentUrl, '_blank')}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Live
          </Button>
        )}

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
  );
}
