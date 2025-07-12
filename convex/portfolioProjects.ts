import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Consolidated query that handles all portfolio project fetching needs
export const getPortfolioData = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("portfolioProjects")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    // Separate featured and all projects
    const featuredProjects = projects.filter((project) => project.featured);
    const projectsByStatus = {
      completed: projects.filter((project) => project.status === "completed"),
      in_progress: projects.filter(
        (project) => project.status === "in_progress"
      ),
      archived: projects.filter((project) => project.status === "archived"),
    };

    return {
      allProjects: projects,
      featuredProjects,
      projectsByStatus,
    };
  },
});

// Keep existing single project query for project detail pages
export const getById = query({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Admin queries for managing portfolio projects
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

export const deleteProject = mutation({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
