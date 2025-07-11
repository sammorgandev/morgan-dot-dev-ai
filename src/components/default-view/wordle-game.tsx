"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WORDLE_WORDS } from "@/lib/constants";

type LetterStatus = "correct" | "present" | "absent" | "empty";

interface GuessResult {
  letter: string;
  status: LetterStatus;
}

export function WordleGame() {
  // Initialize game state directly - no useEffect needed!
  const [targetWord, setTargetWord] = useState<string>(
    () => WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)]
  );
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [usedLetters, setUsedLetters] = useState<Record<string, LetterStatus>>(
    {}
  );

  const startNewGame = () => {
    const randomWord =
      WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setGameWon(false);
    setUsedLetters({});
  };

  const evaluateGuess = useCallback(
    (guess: string, target: string): GuessResult[] => {
      const result: GuessResult[] = [];
      const targetArray = target.split("");
      const guessArray = guess.split("");

      // First pass: mark correct letters
      for (let i = 0; i < 5; i++) {
        if (guessArray[i] === targetArray[i]) {
          result[i] = { letter: guessArray[i], status: "correct" };
          targetArray[i] = "";
        } else {
          result[i] = { letter: guessArray[i], status: "absent" };
        }
      }

      // Second pass: mark present letters
      for (let i = 0; i < 5; i++) {
        if (result[i].status === "absent") {
          const targetIndex = targetArray.indexOf(guessArray[i]);
          if (targetIndex !== -1) {
            result[i].status = "present";
            targetArray[targetIndex] = "";
          }
        }
      }

      return result;
    },
    []
  );

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5 || gameOver) return;

    const guessResult = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, guessResult];
    setGuesses(newGuesses);

    // Update used letters
    const newUsedLetters = { ...usedLetters };
    guessResult.forEach(({ letter, status }) => {
      if (
        !newUsedLetters[letter] ||
        status === "correct" ||
        (status === "present" && newUsedLetters[letter] === "absent")
      ) {
        newUsedLetters[letter] = status;
      }
    });
    setUsedLetters(newUsedLetters);

    // Check if game is won
    if (currentGuess === targetWord) {
      setGameWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
    }

    setCurrentGuess("");
  }, [currentGuess, targetWord, guesses, gameOver, usedLetters, evaluateGuess]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (
        key.length === 1 &&
        /[A-Z]/.test(key) &&
        currentGuess.length < 5
      ) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameOver, submitGuess]
  );

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key === "Enter") {
        handleKeyPress("ENTER");
      } else if (event.key === "Backspace") {
        handleKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const getLetterColor = (status: LetterStatus): string => {
    switch (status) {
      case "correct":
        return "bg-green-400 text-white border-green-400";
      case "present":
        return "bg-yellow-300 text-white border-yellow-300";
      case "absent":
        return "bg-gray-300 text-white border-gray-300";
      default:
        return "bg-background border-border";
    }
  };

  const getKeyColor = (letter: string): string => {
    const status = usedLetters[letter];
    if (!status) return "bg-muted hover:bg-muted/80";
    return getLetterColor(status);
  };

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const guess = guesses[i];
        const letter = guess ? guess[j] : null;
        const isCurrentRow = i === guesses.length && j < currentGuess.length;
        const currentLetter = isCurrentRow ? currentGuess[j] : "";

        row.push(
          <div
            key={`${i}-${j}`}
            className={`w-12 h-12 border-2 flex items-center justify-center text-lg font-bold ${
              letter
                ? getLetterColor(letter.status)
                : isCurrentRow
                  ? "bg-background border-primary"
                  : "bg-background border-border"
            }`}
          >
            {letter?.letter || currentLetter}
          </div>
        );
      }
      rows.push(
        <div key={i} className="flex gap-1">
          {row}
        </div>
      );
    }
    return rows;
  };

  const renderKeyboard = () => {
    const keyboardRows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
    ];

    return keyboardRows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-1 justify-center">
        {row.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className={`h-12 ${
              key === "ENTER" || key === "BACKSPACE" ? "px-3" : "w-10"
            } ${getKeyColor(key)}`}
            onClick={() => handleKeyPress(key)}
          >
            {key === "BACKSPACE" ? "⌫" : key}
          </Button>
        ))}
      </div>
    ));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Wordle</h3>
          <p className="text-sm text-muted-foreground">
            Guess the 5-letter word in 6 tries
          </p>
        </div>

        {/* Game Grid */}
        <div className="flex flex-col items-center gap-1">{renderGrid()}</div>

        {/* Game Status */}
        {gameOver && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              {gameWon ? "🎉 You won!" : "😔 Game Over"}
            </p>
            <p className="text-sm text-muted-foreground">
              The word was: <span className="font-bold">{targetWord}</span>
            </p>
            <Button onClick={startNewGame} size="sm">
              Play Again
            </Button>
          </div>
        )}

        {/* Keyboard */}
        <div className="space-y-1">{renderKeyboard()}</div>
      </div>
    </Card>
  );
}
