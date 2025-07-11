"use client";

import { useState, useEffect } from "react";
import { DESIGN_EXAMPLES } from "@/lib/constants";

export function useAnimatedPlaceholder() {
  const [currentExample, setCurrentExample] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentText = DESIGN_EXAMPLES[currentExample];

    if (isTyping) {
      if (displayText.length < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, wait before deleting
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next example
        setCurrentExample((prev) => (prev + 1) % DESIGN_EXAMPLES.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentExample]);

  return displayText;
}
