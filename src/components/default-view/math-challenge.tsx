"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MathProblem {
  num1: number;
  num2: number;
  operation: string;
  answer: number;
}

export function MathChallenge() {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const generateProblem = (): MathProblem => {
    const operations = ["+", "-", "×"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number;
    
    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        answer = num1 - num2;
        break;
      case "×":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }
    
    return { num1, num2, operation, answer };
  };

  const startNewGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    setFeedback("");
    setProblem(generateProblem());
  };

  const checkAnswer = useCallback(() => {
    if (!problem || !userAnswer) return;
    
    const answer = parseInt(userAnswer);
    if (answer === problem.answer) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback("✓ Correct!");
      setTimeLeft(timeLeft + 2); // Bonus time
    } else {
      setStreak(0);
      setFeedback(`✗ Wrong! ${problem.num1} ${problem.operation} ${problem.num2} = ${problem.answer}`);
    }
    
    setUserAnswer("");
    setTimeout(() => {
      setFeedback("");
      setProblem(generateProblem());
    }, 1000);
  }, [problem, userAnswer, score, streak, timeLeft]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: number;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Math Challenge</h3>
          <p className="text-sm text-muted-foreground">
            Solve as many problems as you can in 30 seconds
          </p>
        </div>

        {/* Score and Timer */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-lg font-semibold">Score: {score}</p>
            <p className="text-sm text-muted-foreground">Streak: {streak}</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-semibold ${timeLeft <= 10 ? "text-red-500" : ""}`}>
              Time: {timeLeft}s
            </p>
          </div>
        </div>

        {/* Problem */}
        {problem && isPlaying && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {problem.num1} {problem.operation} {problem.num2} = ?
              </p>
            </div>
            
            <div className="space-y-2">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer..."
                className="text-center text-lg"
                autoFocus
              />
              <Button 
                onClick={checkAnswer} 
                className="w-full"
                disabled={!userAnswer}
              >
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="text-center">
            <p className={`text-lg font-semibold ${feedback.includes("✓") ? "text-green-600" : "text-red-600"}`}>
              {feedback}
            </p>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">⏰ Time's Up!</p>
            <p className="text-sm text-muted-foreground">
              Final Score: {score} problems solved
            </p>
            <p className="text-sm text-muted-foreground">
              Best Streak: {streak}
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
              Start Challenge
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}