import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, DicesIcon } from "lucide-react";
import { useAnimatedPlaceholder } from "@/components/default-view/animated-placeholder";
import { AnimatedLoading } from "@/components/default-view/animated-loading";
import { LoadingView } from "@/components/default-view/loading-view";
import { StatusMessages } from "@/components/default-view/status-messages";
import { useAppStore } from "@/lib/store";
import { getRandomPrompt } from "@/lib/prompts";
import { sendMessage } from "@/app/actions";
import { useActionState, useEffect } from "react";

export function PromptForm() {
  const {
    prompt,
    setPrompt,
    setShowDemo,
    setDemoUrl,
    setCurrentProjectId,
    showDemo,
  } = useAppStore();
  const [state, formAction, isPending] = useActionState(sendMessage, null);
  const animatedPlaceholder = useAnimatedPlaceholder();

  // Handle successful generation (moved to useEffect to avoid setState in render)
  useEffect(() => {
    if (state?.success && state.data?.demo) {
      setShowDemo(true);
      setDemoUrl(state.data.demo);
      if (state.data.projectId) {
        setCurrentProjectId(state.data.projectId);
      }
    }
  }, [state, setShowDemo, setDemoUrl, setCurrentProjectId]);

  // Show loading view while pending
  if (isPending) {
    return <LoadingView />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // Only prevent default if validation fails
    if (!prompt.trim() || isPending) {
      e.preventDefault();
      return;
    }

    // Let the form's action prop handle the submission
  };

  const handleRandomPrompt = () => {
    if (isPending) return;
    const randomPrompt = getRandomPrompt();
    setPrompt(randomPrompt);
  };

  return (
    <div className="space-y-3 w-[400px] md:w-[550px] lg:w-[700px]">
      <label
        htmlFor="message"
        className="text-lg font-medium text-foreground lg:ml-4"
      >
        What do you want this site to look like?
      </label>

      {/* Status Messages */}
      <StatusMessages actionState={state} showDemo={showDemo} />

      {/* Prompt Box */}
      <Card
        className={`p-6 border-2 mt-4 transition-all duration-200 hover:border-primary/50 hover:shadow-lg ${
          isPending ? "border-primary/50 shadow-lg" : ""
        }`}
      >
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={animatedPlaceholder}
              className="w-full min-h-[120px] text-base resize-none border-0 shadow-none dark:bg-card bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 break-words"
              disabled={isPending}
              name="message"
              id="message"
            />
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                <AnimatedLoading />
              </div>
            )}
          </div>

          <div className="flex justify-end items-end">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRandomPrompt}
                disabled={isPending}
                className="group transition-all cursor-pointer duration-200 hover:shadow-md"
                title="Get a random creative prompt"
              >
                <DicesIcon className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </Button>
              <Button
                type="submit"
                disabled={!prompt.trim() || isPending}
                className="group transition-all cursor-pointer duration-200 hover:shadow-md"
              >
                <span>{isPending ? "Generating..." : "Generate"}</span>
                {!isPending && (
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
