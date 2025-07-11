"use server";

import { v0 } from "v0-sdk";
import type { ActionState } from "@/lib/types";
import { DESIGN_KEYWORDS, BASE_URL } from "@/lib/constants";
import { SYSTEM_PROMPT } from "@/lib/prompts";

// Validate the user's prompt
function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return {
      isValid: false,
      error: "Please enter a prompt to describe how you want the site to look.",
    };
  }

  const trimmedPrompt = prompt.trim();

  // Check minimum length
  if (trimmedPrompt.length < 10) {
    return {
      isValid: false,
      error:
        "Please provide a more detailed description (at least 10 characters).",
    };
  }

  const hasDesignKeywords = DESIGN_KEYWORDS.some((keyword) =>
    trimmedPrompt.toLowerCase().includes(keyword)
  );

  if (!hasDesignKeywords) {
    return {
      isValid: false,
      error:
        "Please describe the visual style, design, or layout you want for the site. For example: 'modern and minimal with dark theme' or 'colorful and animated with gradients'.",
    };
  }

  return { isValid: true };
}

export async function sendMessage(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const message = formData.get("message");

  // Validate message
  if (!message || typeof message !== "string") {
    return { error: "Message is required" };
  }

  // Validate prompt content
  const validation = validatePrompt(message);
  if (!validation.isValid) {
    return { error: validation.error };
  }

  // Transform the prompt
  const transformedPrompt = SYSTEM_PROMPT(message);

  try {
    // Create chat with v0 platform API
    const chat = await v0.chats.create({
      message: transformedPrompt,
    });

    // Return structured response with demo property
    return {
      success: true,
      data: {
        id: chat.id,
        demo: chat.demo, // This should contain the iframe URL
        files: chat.files || [],
      },
    };
  } catch (error) {
    console.error("Error creating chat with v0:", error);
    return {
      error: "Failed to generate site customization. Please try again.",
    };
  }
}
