"use client";

import { AnimatedLoading } from "@/components/default-view/animated-loading";
import { WordleGame } from "@/components/default-view/wordle-game";
import { Card } from "@/components/ui/card";

export function LoadingView() {
  return (
    <div className="space-y-6">
      {/* Loading Status */}
      <Card className="p-6 border-2 border-primary/50 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Creating Your Site</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This may take a moment. Play some Wordle while you wait!
            </p>
          </div>
          <AnimatedLoading />
        </div>
      </Card>

      {/* Wordle Game */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <WordleGame />
        </div>
      </div>
    </div>
  );
}
