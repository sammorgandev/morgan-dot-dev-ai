import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create a new project
export const createProject = mutation({
  args: {
    prompt: v.string(),
    demoUrl: v.optional(v.string()),
    chatId: v.optional(v.string()),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      prompt: args.prompt,
      demoUrl: args.demoUrl,
      chatId: args.chatId,
      createdAt: now,
      updatedAt: now,
      status: "active",
    });

    // Create chat session if chatId is provided
    if (args.chatId) {
      await ctx.db.insert("chatSessions", {
        projectId,
        chatId: args.chatId,
        status: "active",
        lastActivity: now,
        messageCount: 0,
        errorCount: 0,
        totalProcessingTime: 0,
      });
    }

    return projectId;
  },
});

// Mutation to update project status
export const updateProjectStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.union(
      v.literal("active"),
      v.literal("error"),
      v.literal("completed")
    ),
    demoUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      status: args.status,
      updatedAt: Date.now(),
      ...(args.demoUrl && { demoUrl: args.demoUrl }),
    });
  },
});

// Mutation to add error to project history
export const addProjectError = mutation({
  args: {
    projectId: v.id("projects"),
    errorType: v.union(
      v.literal("load_error"),
      v.literal("runtime_error"),
      v.literal("network_error")
    ),
    errorMessage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const newError = {
      type: args.errorType,
      message: args.errorMessage,
      timestamp: Date.now(),
      resolved: false,
    };

    const updatedErrorHistory = [...(project.errorHistory || []), newError];

    await ctx.db.patch(args.projectId, {
      errorHistory: updatedErrorHistory,
      status: "error",
      updatedAt: Date.now(),
    });
  },
});

// Mutation to save files for a project
export const saveFiles = mutation({
  args: {
    projectId: v.id("projects"),
    files: v.array(
      v.object({
        filename: v.string(),
        content: v.string(),
        language: v.string(),
      })
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Mark existing files as not latest
    const existingFiles = await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const file of existingFiles) {
      await ctx.db.patch(file._id, { isLatest: false });
    }

    // Insert new files
    for (const [index, file] of args.files.entries()) {
      await ctx.db.insert("files", {
        projectId: args.projectId,
        filename: file.filename,
        content: file.content,
        language: file.language,
        createdAt: now,
        updatedAt: now,
        version: index + 1,
        isLatest: true,
      });
    }

    // Update project timestamp
    await ctx.db.patch(args.projectId, { updatedAt: now });
  },
});

// Mutation to save a chat message
export const saveChatMessage = mutation({
  args: {
    projectId: v.id("projects"),
    chatId: v.string(),
    messageId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(
      v.object({
        isError: v.optional(v.boolean()),
        errorDetails: v.optional(v.string()),
        originalPrompt: v.optional(v.string()),
        processingTime: v.optional(v.number()),
      })
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Save the message
    await ctx.db.insert("messages", {
      projectId: args.projectId,
      chatId: args.chatId,
      messageId: args.messageId,
      role: args.role,
      content: args.content,
      timestamp: now,
      metadata: args.metadata,
    });

    // Update chat session
    const chatSession = await ctx.db
      .query("chatSessions")
      .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
      .first();

    if (chatSession) {
      await ctx.db.patch(chatSession._id, {
        lastActivity: now,
        messageCount: chatSession.messageCount + 1,
        ...(args.metadata?.isError && {
          errorCount: (chatSession.errorCount || 0) + 1,
        }),
        ...(args.metadata?.processingTime && {
          totalProcessingTime:
            (chatSession.totalProcessingTime || 0) +
            args.metadata.processingTime,
        }),
      });
    }
  },
});

// Mutation to save multiple chat messages (for bulk operations)
export const saveChatMessages = mutation({
  args: {
    projectId: v.id("projects"),
    chatId: v.string(),
    messages: v.array(
      v.object({
        messageId: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        metadata: v.optional(
          v.object({
            isError: v.optional(v.boolean()),
            errorDetails: v.optional(v.string()),
            originalPrompt: v.optional(v.string()),
            processingTime: v.optional(v.number()),
          })
        ),
      })
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Save all messages
    for (const message of args.messages) {
      await ctx.db.insert("messages", {
        projectId: args.projectId,
        chatId: args.chatId,
        messageId: message.messageId,
        role: message.role,
        content: message.content,
        timestamp: now,
        metadata: message.metadata,
      });
    }

    // Update chat session
    const chatSession = await ctx.db
      .query("chatSessions")
      .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
      .first();

    if (chatSession) {
      const errorCount = args.messages.filter(
        (m) => m.metadata?.isError
      ).length;
      const totalProcessingTime = args.messages.reduce(
        (sum, m) => sum + (m.metadata?.processingTime || 0),
        0
      );

      await ctx.db.patch(chatSession._id, {
        lastActivity: now,
        messageCount: chatSession.messageCount + args.messages.length,
        ...(errorCount > 0 && {
          errorCount: (chatSession.errorCount || 0) + errorCount,
        }),
        ...(totalProcessingTime > 0 && {
          totalProcessingTime:
            (chatSession.totalProcessingTime || 0) + totalProcessingTime,
        }),
      });
    }
  },
});

// Query to get recent projects
export const getRecentProjects = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      prompt: v.string(),
      demoUrl: v.optional(v.string()),
      chatId: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
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
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("projects")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

// Query to get a project by ID
export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.union(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      prompt: v.string(),
      demoUrl: v.optional(v.string()),
      chatId: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.optional(v.number()),
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
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

// Query to get chat messages for a project
export const getChatMessages = query({
  args: {
    projectId: v.id("projects"),
    chatId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
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
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.chatId) {
      return await ctx.db
        .query("messages")
        .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId!))
        .order("asc")
        .take(limit);
    } else {
      return await ctx.db
        .query("messages")
        .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
        .order("asc")
        .take(limit);
    }
  },
});

// Query to get project with files (existing function, keeping for backward compatibility)
export const getProjectWithFiles = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.union(
    v.object({
      project: v.object({
        _id: v.id("projects"),
        _creationTime: v.number(),
        prompt: v.string(),
        demoUrl: v.optional(v.string()),
        chatId: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
        status: v.optional(
          v.union(
            v.literal("active"),
            v.literal("error"),
            v.literal("completed")
          )
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
      }),
      files: v.array(
        v.object({
          _id: v.id("files"),
          _creationTime: v.number(),
          projectId: v.id("projects"),
          filename: v.string(),
          content: v.string(),
          language: v.string(),
          createdAt: v.number(),
          updatedAt: v.optional(v.number()),
          version: v.optional(v.number()),
          isLatest: v.optional(v.boolean()),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_latest", (q) =>
        q.eq("projectId", args.projectId).eq("isLatest", true)
      )
      .order("asc")
      .collect();

    return {
      project,
      files,
    };
  },
});

// Query to get full project data with messages and files
export const getFullProjectData = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.union(
    v.object({
      project: v.object({
        _id: v.id("projects"),
        _creationTime: v.number(),
        prompt: v.string(),
        demoUrl: v.optional(v.string()),
        chatId: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
        status: v.optional(
          v.union(
            v.literal("active"),
            v.literal("error"),
            v.literal("completed")
          )
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
      }),
      files: v.array(
        v.object({
          _id: v.id("files"),
          _creationTime: v.number(),
          projectId: v.id("projects"),
          filename: v.string(),
          content: v.string(),
          language: v.string(),
          createdAt: v.number(),
          updatedAt: v.optional(v.number()),
          version: v.optional(v.number()),
          isLatest: v.optional(v.boolean()),
        })
      ),
      messages: v.array(
        v.object({
          _id: v.id("messages"),
          _creationTime: v.number(),
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
      ),
      chatSession: v.optional(
        v.object({
          _id: v.id("chatSessions"),
          _creationTime: v.number(),
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
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_latest", (q) =>
        q.eq("projectId", args.projectId).eq("isLatest", true)
      )
      .order("asc")
      .collect();

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();

    const chatSession = project.chatId
      ? await ctx.db
          .query("chatSessions")
          .withIndex("by_chat_id", (q) => q.eq("chatId", project.chatId!))
          .first()
      : undefined;

    return {
      project,
      files,
      messages,
      chatSession: chatSession || undefined,
    };
  },
});
