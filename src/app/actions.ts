"use server";

import { v0 } from "v0-sdk";
import type {
  ActionState,
  ContinueChatActionState,
  ChatMessage,
} from "@/lib/types";
import { DESIGN_KEYWORDS, PUBLIC_IMAGE_URL } from "@/lib/constants";
// Removed SYSTEM_PROMPT - using more flexible approach
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  captureScreenshotWithRetry,
  uploadScreenshotToConvex,
} from "@/lib/screenshot";
import { syncGeneratedSite, checkDeploymentStatus } from "@/lib/github-sync";

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

// Validate continuation message (less strict than initial prompt)
function validateContinuationMessage(message: string): {
  isValid: boolean;
  error?: string;
} {
  if (!message || typeof message !== "string" || !message.trim()) {
    return {
      isValid: false,
      error: "Please enter a message to continue the conversation.",
    };
  }

  const trimmedMessage = message.trim();

  // Check minimum length (more lenient for continuation)
  if (trimmedMessage.length < 5) {
    return {
      isValid: false,
      error: "Please provide a more detailed message (at least 5 characters).",
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

  // Create flexible prompt with core info but creative freedom
  const flexiblePrompt = `Create a portfolio website for Sam Morgan, a Software Engineer, with this design style: ${message}

Core information to include:
- Name: Sam Morgan
- Title: Software Engineer  
- Currently working at Bubble (https://bubble.io)
- Previously worked at soiheardmusic (https://soiheardmusic.com)
- Social links: GitHub (https://github.com/sammorgan), LinkedIn (https://linkedin.com/in/sammorgan), Email (sam@sammorgan.dev)
- Profile image: ${PUBLIC_IMAGE_URL}/pic.jpg

Feel free to be creative with the layout, styling, animations, and overall design approach. Use React, TypeScript, and Tailwind CSS. Make it responsive and engaging.`;

  try {
    // Create chat with v0 platform API
    const chat = await v0.chats.create({
      message: flexiblePrompt,
    });

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Save project to database
    const projectId = await convex.mutation(api.projects.createProject, {
      prompt: message,
      demoUrl: chat.demo,
      chatId: chat.id,
    });

    // Save files to database if they exist
    if (chat.files && chat.files.length > 0) {
      const files = chat.files.map((file) => ({
        filename: file.meta?.file || `file_${Date.now()}`,
        content: file.source,
        language: file.lang || "javascript",
      }));

      await convex.mutation(api.projects.saveFiles, {
        projectId,
        files,
      });

      // Start deployment process
      await convex.mutation(api.projects.startDeployment, {
        projectId,
      });

      // Start GitHub sync process asynchronously
      syncGeneratedSite(projectId, files)
        .then(async (syncResult) => {
          if (syncResult.success) {
            // Mark deployment as successful
            await convex.mutation(api.projects.completeDeployment, {
              projectId,
              localUrl: syncResult.localUrl!,
              commitSha: syncResult.commitSha,
            });

            // Wait for deployment to be live
            const isDeployed = await checkDeploymentStatus(projectId);
            if (isDeployed) {
              console.log("Deployment is live for project:", projectId);
            }
          } else {
            // Mark deployment as failed
            await convex.mutation(api.projects.failDeployment, {
              projectId,
              error: syncResult.error || "Unknown deployment error",
            });
          }
        })
        .catch(async (error) => {
          console.error("GitHub sync failed:", error);
          await convex.mutation(api.projects.failDeployment, {
            projectId,
            error: error instanceof Error ? error.message : String(error),
          });
        });
    }

    // Save initial messages to database
    const initialMessages: ChatMessage[] = [
      {
        id: `user_${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      },
      {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: `I've created a portfolio website with the style you requested. The site includes all your professional information and is built with React, TypeScript, and Tailwind CSS.`,
        timestamp: new Date(),
      },
    ];

    // Save messages to database
    await convex.mutation(api.projects.saveChatMessages, {
      projectId,
      chatId: chat.id,
      messages: initialMessages.map((msg) => ({
        messageId: msg.id,
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata,
      })),
    });

    // Capture screenshot asynchronously (don't wait for it to complete)
    if (chat.demo) {
      captureScreenshotWithRetry(chat.demo, {
        width: 1200,
        height: 800,
        timeout: 30000,
        delay: 3000,
      })
        .then(async (screenshotBlob) => {
          // Upload screenshot to Convex storage
          await uploadScreenshotToConvex(
            screenshotBlob,
            projectId,
            process.env.NEXT_PUBLIC_CONVEX_URL!
          );
          console.log(
            "Screenshot captured successfully for project:",
            projectId
          );
        })
        .catch((error) => {
          console.error("Failed to capture screenshot:", error);
          // Don't fail the main request if screenshot fails
        });
    }

    // Return structured response with demo property and projectId
    return {
      success: true,
      data: {
        id: chat.id,
        demo: chat.demo, // This should contain the iframe URL
        files: chat.files || [],
        projectId, // Add projectId to the response
        messages: initialMessages,
      },
    };
  } catch (error) {
    console.error("Error creating chat with v0:", error);
    return {
      error: "Failed to generate site customization. Please try again.",
    };
  }
}

// New action to continue v0 conversations
export async function continueChat(
  prevState: ContinueChatActionState,
  formData: FormData
): Promise<ContinueChatActionState> {
  const message = formData.get("message");
  const chatId = formData.get("chatId");
  const projectId = formData.get("projectId");

  // Validate required fields
  if (!message || typeof message !== "string") {
    return { error: "Message is required" };
  }

  if (!chatId || typeof chatId !== "string") {
    return { error: "Chat ID is required" };
  }

  if (!projectId || typeof projectId !== "string") {
    return { error: "Project ID is required" };
  }

  // Validate continuation message
  const validation = validateContinuationMessage(message);
  if (!validation.isValid) {
    return { error: validation.error };
  }

  try {
    const startTime = Date.now();

    // Continue the chat with v0 platform API
    const chat = await v0.chats.createMessage({
      chatId,
      message: message.trim(),
    });

    const processingTime = Date.now() - startTime;

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Create messages for the conversation
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: `assistant_${Date.now()}`,
      role: "assistant",
      content: `I've updated the website based on your feedback. The changes have been applied to address your request.`,
      timestamp: new Date(),
      metadata: {
        processingTime,
      },
    };

    // Save the new messages to database
    await convex.mutation(api.projects.saveChatMessages, {
      projectId: projectId as Id<"projects">,
      chatId,
      messages: [userMessage, assistantMessage].map((msg) => ({
        messageId: msg.id,
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata,
      })),
    });

    // Update files if they exist
    if (chat.files && chat.files.length > 0) {
      const files = chat.files.map((file) => ({
        filename: file.meta?.file || `file_${Date.now()}`,
        content: file.source,
        language: file.lang || "javascript",
      }));

      await convex.mutation(api.projects.saveFiles, {
        projectId: projectId as Id<"projects">,
        files,
      });

      // Start deployment process
      await convex.mutation(api.projects.startDeployment, {
        projectId: projectId as Id<"projects">,
      });

      // Start GitHub sync process asynchronously
      syncGeneratedSite(projectId, files)
        .then(async (syncResult) => {
          if (syncResult.success) {
            // Mark deployment as successful
            await convex.mutation(api.projects.completeDeployment, {
              projectId: projectId as Id<"projects">,
              localUrl: syncResult.localUrl!,
              commitSha: syncResult.commitSha,
            });

            // Wait for deployment to be live
            const isDeployed = await checkDeploymentStatus(projectId);
            if (isDeployed) {
              console.log("Deployment updated for project:", projectId);
            }
          } else {
            // Mark deployment as failed
            await convex.mutation(api.projects.failDeployment, {
              projectId: projectId as Id<"projects">,
              error: syncResult.error || "Unknown deployment error",
            });
          }
        })
        .catch(async (error) => {
          console.error("GitHub sync failed:", error);
          await convex.mutation(api.projects.failDeployment, {
            projectId: projectId as Id<"projects">,
            error: error instanceof Error ? error.message : String(error),
          });
        });
    }

    // Update project status and demo URL
    await convex.mutation(api.projects.updateProjectStatus, {
      projectId: projectId as Id<"projects">,
      status: "active",
      demoUrl: chat.demo,
    });

    // Capture screenshot asynchronously (don't wait for it to complete)
    if (chat.demo) {
      captureScreenshotWithRetry(chat.demo, {
        width: 1200,
        height: 800,
        timeout: 30000,
        delay: 3000,
      })
        .then(async (screenshotBlob) => {
          // Upload screenshot to Convex storage
          await uploadScreenshotToConvex(
            screenshotBlob,
            projectId as Id<"projects">,
            process.env.NEXT_PUBLIC_CONVEX_URL!
          );
          console.log(
            "Screenshot updated successfully for project:",
            projectId
          );
        })
        .catch((error) => {
          console.error("Failed to update screenshot:", error);
          // Don't fail the main request if screenshot fails
        });
    }

    // Return structured response
    return {
      success: true,
      data: {
        id: chatId,
        demo: chat.demo,
        files: chat.files || [],
        projectId,
        messages: [userMessage, assistantMessage],
      },
    };
  } catch (error) {
    console.error("Error continuing chat with v0:", error);

    // Initialize Convex client for error logging
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Log error to database
    try {
      await convex.mutation(api.projects.addProjectError, {
        projectId: projectId as Id<"projects">,
        errorType: "runtime_error",
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    } catch (logError) {
      console.error("Failed to log error to database:", logError);
    }

    return {
      error: "Failed to continue the conversation. Please try again.",
    };
  }
}

// Action to handle automatic error recovery
export async function handleErrorRecovery(
  prevState: ContinueChatActionState,
  formData: FormData
): Promise<ContinueChatActionState> {
  const errorMessage = formData.get("errorMessage");
  const chatId = formData.get("chatId");
  const projectId = formData.get("projectId");
  const originalPrompt = formData.get("originalPrompt");

  // Validate required fields
  if (!errorMessage || typeof errorMessage !== "string") {
    return { error: "Error message is required" };
  }

  if (!chatId || typeof chatId !== "string") {
    return { error: "Chat ID is required" };
  }

  if (!projectId || typeof projectId !== "string") {
    return { error: "Project ID is required" };
  }

  // Create more specific error recovery message based on error type
  let recoveryMessage = "";

  if (
    errorMessage.includes("CORS") ||
    errorMessage.includes("Access-Control-Allow-Origin") ||
    errorMessage.includes("fonts.googleapis.com") ||
    errorMessage.includes("esm.v0.dev")
  ) {
    recoveryMessage = `The website has CORS (Cross-Origin Resource Sharing) errors that prevent external resources from loading properly. The specific error is:

${errorMessage}

Please fix this by:
1. Replace ALL Google Fonts imports with system fonts (e.g., font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
2. Remove any external CDN imports that may have CORS restrictions
3. Use inline styles or bundled CSS instead of external stylesheets
4. Avoid importing resources from esm.v0.dev or other external sources
5. Use local font files or web-safe fonts instead of Google Fonts

IMPORTANT: Do not use any external font imports or CDN resources. Use only system fonts and local resources.`;
  } else if (
    errorMessage.includes("FatalRendererError") ||
    errorMessage.includes("Failed to load global configs") ||
    errorMessage.includes("Unsupported Content-Type") ||
    errorMessage.includes("Modules must be served with a valid MIME type")
  ) {
    recoveryMessage = `The website has critical module loading errors that prevent it from rendering. The specific error is:

${errorMessage}

Please fix this by:
1. Remove any external module imports that may be causing MIME type issues
2. Use only standard React/TypeScript imports
3. Avoid importing from esm.v0.dev or other external module sources
4. Replace any problematic imports with local implementations
5. Use standard Tailwind CSS classes instead of external config imports
6. Ensure all imports are from standard npm packages or local files

IMPORTANT: Focus on making the code work with standard React/TypeScript imports only.`;
  } else if (
    errorMessage.includes("Failed to load") ||
    errorMessage.includes("loading issues")
  ) {
    recoveryMessage = `The website has resource loading errors. The specific error is:

${errorMessage}

Please fix this by:
1. Checking that all imported resources exist and are accessible
2. Using alternative resources if external CDNs are failing
3. Adding proper error handling for failed resource loads
4. Using fallback fonts or styles when external resources fail
5. Simplifying the imports to use only standard React/TypeScript libraries

Update the code to handle these loading issues gracefully.`;
  } else {
    // Generic error recovery message
    recoveryMessage = `The code returns the following error:

${errorMessage}

Please revise the code to address this error. Focus on:
1. Simplifying external dependencies
2. Using standard React/TypeScript patterns
3. Avoiding external resource imports that may fail
4. Using system fonts instead of external fonts

Update the code to make it work reliably.`;
  }

  // Use the continue chat action to handle the error recovery
  const recoveryFormData = new FormData();
  recoveryFormData.append("message", recoveryMessage);
  recoveryFormData.append("chatId", chatId);
  recoveryFormData.append("projectId", projectId);

  try {
    const result = await continueChat(null, recoveryFormData);

    if (result && result.success) {
      // Find the user message that was just created and update it with error metadata
      const userMessage = result.data?.messages?.find(
        (msg) => msg.role === "user"
      );
      if (userMessage) {
        // Update the message with error metadata
        userMessage.metadata = {
          ...userMessage.metadata,
          isError: true,
          errorDetails: errorMessage,
          originalPrompt:
            typeof originalPrompt === "string" ? originalPrompt : undefined,
        };
      }
    }

    return (
      result || { error: "Failed to recover from error. Please try again." }
    );
  } catch (error) {
    console.error("Error in error recovery:", error);
    return {
      error: "Failed to recover from error. Please try again.",
    };
  }
}
