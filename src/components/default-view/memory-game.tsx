"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

export function MemoryGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<number>(-1);

  const startNewGame = () => {
    const firstColor = Math.floor(Math.random() * COLORS.length);
    setSequence([firstColor]);
    setPlayerSequence([]);
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    showSequence([firstColor]);
  };

  const showSequence = useCallback((seq: number[]) => {
    setIsShowingSequence(true);
    setActiveColor(-1);

    seq.forEach((colorIndex, index) => {
      setTimeout(() => {
        setActiveColor(colorIndex);
      }, index * 600);

      setTimeout(
        () => {
          setActiveColor(-1);
        },
        index * 600 + 300
      );
    });

    setTimeout(() => {
      setIsShowingSequence(false);
    }, seq.length * 600);
  }, []);

  const handleColorClick = (colorIndex: number) => {
    if (isShowingSequence || gameOver) return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      // Player completed the sequence
      const newScore = score + 1;
      setScore(newScore);
      setCurrentIndex(0);
      setPlayerSequence([]);

      // Add new color to sequence
      const newSequence = [
        ...sequence,
        Math.floor(Math.random() * COLORS.length),
      ];
      setSequence(newSequence);

      setTimeout(() => {
        showSequence(newSequence);
      }, 1000);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getColorClass = (colorIndex: number): string => {
    const baseClasses =
      "w-20 h-20 rounded-lg border-4 cursor-pointer transition-all duration-200 flex items-center justify-center text-white font-bold";
    const isActive = activeColor === colorIndex;

    switch (COLORS[colorIndex]) {
      case "red":
        return `${baseClasses} ${isActive ? "bg-red-400 border-red-300" : "bg-red-500 border-red-400"} hover:bg-red-400`;
      case "blue":
        return `${baseClasses} ${isActive ? "bg-blue-400 border-blue-300" : "bg-blue-500 border-blue-400"} hover:bg-blue-400`;
      case "green":
        return `${baseClasses} ${isActive ? "bg-green-400 border-green-300" : "bg-green-500 border-green-400"} hover:bg-green-400`;
      case "yellow":
        return `${baseClasses} ${isActive ? "bg-yellow-400 border-yellow-300" : "bg-yellow-500 border-yellow-400"} hover:bg-yellow-400`;
      case "purple":
        return `${baseClasses} ${isActive ? "bg-purple-400 border-purple-300" : "bg-purple-500 border-purple-400"} hover:bg-purple-400`;
      case "orange":
        return `${baseClasses} ${isActive ? "bg-orange-400 border-orange-300" : "bg-orange-500 border-orange-400"} hover:bg-orange-400`;
      default:
        return baseClasses;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Memory Game</h3>
          <p className="text-sm text-muted-foreground">
            Watch the sequence and repeat it
          </p>
        </div>

        {/* Score */}
        <div className="text-center">
          <p className="text-lg font-semibold">Score: {score}</p>
          {isShowingSequence && (
            <p className="text-sm text-muted-foreground">Watch carefully...</p>
          )}
          {isPlaying && !isShowingSequence && (
            <p className="text-sm text-muted-foreground">Your turn!</p>
          )}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          {COLORS.map((_, index) => (
            <button
              key={index}
              className={getColorClass(index)}
              onClick={() => handleColorClick(index)}
              disabled={isShowingSequence || gameOver}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Game Status */}
        {gameOver && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">😔 Game Over!</p>
            <p className="text-sm text-muted-foreground">
              You reached level {score + 1}
            </p>
            <Button onClick={startNewGame} size="sm">
              Play Again
            </Button>
          </div>
        )}

        {/* Start Button */}
        {!isPlaying && !gameOver && (
          <div className="text-center">
            <Button onClick={startNewGame} size="sm">
              Start Game
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
