"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NumberGuessingGame() {
  const [targetNumber, setTargetNumber] = useState<number>(
    () => Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [hint, setHint] = useState<string>("I'm thinking of a number between 1 and 100");

  const startNewGame = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNumber);
    setGuess("");
    setGuesses([]);
    setGameOver(false);
    setGameWon(false);
    setHint("I'm thinking of a number between 1 and 100");
  };

  const submitGuess = useCallback(() => {
    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100 || gameOver) return;

    const newGuesses = [...guesses, numGuess];
    setGuesses(newGuesses);

    if (numGuess === targetNumber) {
      setGameWon(true);
      setGameOver(true);
      setHint(`🎉 Correct! You found it in ${newGuesses.length} tries!`);
    } else if (newGuesses.length >= 7) {
      setGameOver(true);
      setHint(`😔 Game Over! The number was ${targetNumber}`);
    } else {
      const direction = numGuess > targetNumber ? "lower" : "higher";
      setHint(`Try ${direction}! (${7 - newGuesses.length} guesses left)`);
    }

    setGuess("");
  }, [guess, targetNumber, guesses, gameOver]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitGuess();
    }
  };

  const getGuessColor = (guessNumber: number): string => {
    const diff = Math.abs(guessNumber - targetNumber);
    if (diff === 0) return "bg-green-400 text-white border-green-400";
    if (diff <= 5) return "bg-yellow-300 text-white border-yellow-300";
    if (diff <= 15) return "bg-orange-300 text-white border-orange-300";
    return "bg-gray-300 text-white border-gray-300";
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Number Guessing</h3>
          <p className="text-sm text-muted-foreground">
            Guess the number in 7 tries or less
          </p>
        </div>

        {/* Hint */}
        <div className="text-center">
          <p className="text-sm font-medium">{hint}</p>
        </div>

        {/* Previous Guesses */}
        {guesses.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Your guesses:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {guesses.map((guessNumber, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${getGuessColor(guessNumber)}`}
                >
                  {guessNumber}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        {!gameOver && (
          <div className="space-y-2">
            <Input
              type="number"
              min="1"
              max="100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess..."
              className="text-center"
            />
            <Button 
              onClick={submitGuess} 
              className="w-full"
              disabled={!guess || isNaN(parseInt(guess))}
            >
              Guess
            </Button>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="text-center">
            <Button onClick={startNewGame} size="sm">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}