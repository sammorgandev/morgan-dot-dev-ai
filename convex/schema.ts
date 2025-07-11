import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    prompt: v.string(),
    demoUrl: v.optional(v.string()),
    chatId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    // Enhanced fields for better project management
    status: v.optional(
      v.union(v.literal("active"), v.literal("error"), v.literal("completed"))
    ),
    errorHistory: v.optional(
      v.array(
        v.object({
          type: v.union(
            v.literal("load_error"),
            v.literal("runtime_error"),
            v.literal("network_error")
          ),
          message: v.string(),
          timestamp: v.number(),
          resolved: v.boolean(),
        })
      )
    ),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_chat_id", ["chatId"])
    .index("by_status", ["status"]),

  files: defineTable({
    projectId: v.id("projects"),
    filename: v.string(),
    content: v.string(),
    language: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    // Enhanced fields for file versioning
    version: v.optional(v.number()),
    isLatest: v.optional(v.boolean()),
  })
    .index("by_project_id", ["projectId"])
    .index("by_project_latest", ["projectId", "isLatest"]),

  // New table for chat messages
  messages: defineTable({
    projectId: v.id("projects"),
    chatId: v.string(),
    messageId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
    metadata: v.optional(
      v.object({
        isError: v.optional(v.boolean()),
        errorDetails: v.optional(v.string()),
        originalPrompt: v.optional(v.string()),
        processingTime: v.optional(v.number()),
      })
    ),
  })
    .index("by_project_id", ["projectId"])
    .index("by_chat_id", ["chatId"])
    .index("by_timestamp", ["timestamp"]),

  // New table for chat sessions
  chatSessions: defineTable({
    projectId: v.id("projects"),
    chatId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("error"),
      v.literal("completed")
    ),
    lastActivity: v.number(),
    messageCount: v.number(),
    errorCount: v.optional(v.number()),
    totalProcessingTime: v.optional(v.number()),
  })
    .index("by_project_id", ["projectId"])
    .index("by_chat_id", ["chatId"])
    .index("by_last_activity", ["lastActivity"]),
});
