import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query all portfolio projects
export const getAllProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("portfolioProjects")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

// Query featured portfolio projects
export const getFeaturedProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("portfolioProjects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
  },
});

// Query projects by status
export const getProjectsByStatus = query({
  args: {
    status: v.union(
      v.literal("completed"),
      v.literal("in_progress"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolioProjects")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Create a new portfolio project
export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    technologies: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    featured: v.boolean(),
    status: v.union(
      v.literal("completed"),
      v.literal("in_progress"),
      v.literal("archived")
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("portfolioProjects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing portfolio project
export const updateProject = mutation({
  args: {
    id: v.id("portfolioProjects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    technologies: v.optional(v.array(v.string())),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    status: v.optional(
      v.union(
        v.literal("completed"),
        v.literal("in_progress"),
        v.literal("archived")
      )
    ),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Get a single portfolio project by ID
export const getById = query({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Delete a portfolio project
export const deleteProject = mutation({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
