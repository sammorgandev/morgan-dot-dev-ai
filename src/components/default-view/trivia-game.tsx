"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography"
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Mars", "Earth"],
    correctAnswer: 1,
    category: "Science"
  },
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "58", "60"],
    correctAnswer: 1,
    category: "Math"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    correctAnswer: 2,
    category: "Art"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    category: "Geography"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    correctAnswer: 1,
    category: "Science"
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
    category: "Math"
  },
  {
    question: "Which country gifted the Statue of Liberty to the USA?",
    options: ["England", "France", "Italy", "Spain"],
    correctAnswer: 1,
    category: "History"
  }
];

export function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const getRandomQuestion = useCallback(() => {
    const availableQuestions = TRIVIA_QUESTIONS.filter((_, index) => !usedQuestions.has(index));
    if (availableQuestions.length === 0) {
      setGameOver(true);
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    const originalIndex = TRIVIA_QUESTIONS.indexOf(selectedQuestion);
    
    setUsedQuestions((prev: Set<number>) => new Set(prev).add(originalIndex));
    return selectedQuestion;
  }, [usedQuestions]);

  const startNewGame = () => {
    setScore(0);
    setUsedQuestions(new Set());
    setSelectedAnswer(null);
    setShowAnswer(false);
    setGameStarted(true);
    setGameOver(false);
    setCurrentQuestion(getRandomQuestion());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setShowAnswer(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      const nextQuestion = getRandomQuestion();
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setShowAnswer(false);
      }
    }, 2000);
  };

  const getButtonClass = (index: number) => {
    if (!showAnswer) {
      return selectedAnswer === index 
        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
        : "bg-background hover:bg-muted";
    }
    
    if (index === currentQuestion?.correctAnswer) {
      return "bg-green-500 text-white hover:bg-green-500";
    }
    
    if (index === selectedAnswer && index !== currentQuestion?.correctAnswer) {
      return "bg-red-500 text-white hover:bg-red-500";
    }
    
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Trivia Challenge</h3>
          <p className="text-sm text-muted-foreground">
            Test your knowledge across different topics
          </p>
        </div>

        {/* Score */}
        {gameStarted && (
          <div className="text-center">
            <p className="text-lg font-semibold">Score: {score}/{TRIVIA_QUESTIONS.length}</p>
          </div>
        )}

        {/* Question */}
        {currentQuestion && gameStarted && !gameOver && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                {currentQuestion.category}
              </p>
              <p className="text-lg font-medium">
                {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-3 ${getButtonClass(index)}`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showAnswer}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>

            {!showAnswer && selectedAnswer !== null && (
              <div className="text-center">
                <Button onClick={submitAnswer} size="sm">
                  Submit Answer
                </Button>
              </div>
            )}

            {showAnswer && (
              <div className="text-center">
                <p className={`text-lg font-semibold ${selectedAnswer === currentQuestion.correctAnswer ? "text-green-600" : "text-red-600"}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? "✓ Correct!" : "✗ Wrong!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">🎉 Quiz Complete!</p>
            <p className="text-sm text-muted-foreground">
              Final Score: {score} out of {TRIVIA_QUESTIONS.length}
            </p>
            <p className="text-sm text-muted-foreground">
              {score === TRIVIA_QUESTIONS.length ? "Perfect score! 🌟" : 
               score >= TRIVIA_QUESTIONS.length * 0.8 ? "Great job! 👏" :
               score >= TRIVIA_QUESTIONS.length * 0.6 ? "Good effort! 👍" : "Keep practicing! 💪"}
            </p>
            <Button onClick={startNewGame} size="sm">
              Play Again
            </Button>
          </div>
        )}

        {/* Start Button */}
        {!gameStarted && !gameOver && (
          <div className="text-center">
            <Button onClick={startNewGame} size="sm">
              Start Quiz
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}