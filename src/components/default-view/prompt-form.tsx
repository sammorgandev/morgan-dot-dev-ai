import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { sendMessage } from "@/app/actions";
import { useAnimatedPlaceholder } from "@/components/default-view/animated-placeholder";
import { AnimatedLoading } from "@/components/default-view/animated-loading";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export function PromptForm() {
  const { prompt, isPending, setPrompt, setActionState, handleSubmitStart } =
    useAppStore();

  const [state, formAction] = useActionState(sendMessage, null);
  const animatedPlaceholder = useAnimatedPlaceholder();

  // Sync useActionState with store
  useEffect(() => {
    if (state) {
      setActionState(state);
    }
  }, [state, setActionState]);

  const handleSubmit = async (e: React.FormEvent) => {
    // Only prevent default if validation fails
    if (!prompt.trim() || isPending) {
      e.preventDefault();
      return;
    }

    handleSubmitStart();
    // Let the form's action prop handle the submission
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="message"
        className="text-lg font-medium text-foreground ml-4"
      >
        What do you want this site to look like?
      </label>

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
              className="min-h-[120px] text-base resize-none border-0 shadow-none dark:bg-card bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
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

          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Describe the visual style, theme, or layout you want
            </div>
            <Button
              type="submit"
              disabled={!prompt.trim() || isPending}
              className="group transition-all duration-200 hover:shadow-md"
            >
              <span>{isPending ? "Generating..." : "Generate"}</span>
              {!isPending && (
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
