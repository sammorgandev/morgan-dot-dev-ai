"use client";

import { useState, useEffect } from "react";
import { PROGRESS_MESSAGES } from "@/lib/constants";

export function AnimatedLoading() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const currentText = PROGRESS_MESSAGES[currentMessage];

    if (displayText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 40);
      return () => clearTimeout(timer);
    } else {
      // Finished typing current message, wait before next
      const timer = setTimeout(() => {
        if (currentMessage < PROGRESS_MESSAGES.length - 1) {
          setCurrentMessage((prev) => prev + 1);
          setDisplayText("");
        } else {
          // Loop back to first message if still loading
          setCurrentMessage(0);
          setDisplayText("");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [displayText, currentMessage]);

  return (
    <div className="flex items-center space-x-2">
      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
      <span className="text-sm text-muted-foreground">
        {displayText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
}
