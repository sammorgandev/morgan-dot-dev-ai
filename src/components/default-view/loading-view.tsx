"use client";

import { AnimatedLoading } from "@/components/default-view/animated-loading";
import { WordleGame } from "@/components/default-view/wordle-game";
import { NumberGuessingGame } from "@/components/default-view/number-guessing-game";
import { MemoryGame } from "@/components/default-view/memory-game";
import { MathChallenge } from "@/components/default-view/math-challenge";
import { TriviaGame } from "@/components/default-view/trivia-game";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";

const GAMES = [
  { component: WordleGame, title: "Wordle" },
  { component: NumberGuessingGame, title: "Number Guessing" },
  { component: MemoryGame, title: "Memory Game" },
  { component: MathChallenge, title: "Math Challenge" },
  { component: TriviaGame, title: "Trivia Challenge" }
];

export function LoadingView() {
  // Randomly select a game when the component loads
  const [selectedGame] = useState(() => {
    const randomIndex = Math.floor(Math.random() * GAMES.length);
    return GAMES[randomIndex];
  });

  const GameComponent = selectedGame.component;

  return (
    <div className="space-y-6">
      {/* Loading Status */}
      <Card className="p-6 border-2 border-primary/50 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Creating Your Site</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This may take a moment. Play some {selectedGame.title} while you wait!
            </p>
          </div>
          <AnimatedLoading />
        </div>
      </Card>

      {/* Random Game */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <GameComponent />
        </div>
      </div>
    </div>
  );
}
