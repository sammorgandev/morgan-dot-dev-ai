import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Consolidated query that handles all blog post fetching needs
export const getBlogData = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    // Extract unique tags from all posts
    const allTags = posts.flatMap((post) => post.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    // Separate featured and recent posts
    const featuredPosts = posts.filter((post) => post.featured);
    const recentPosts = posts.filter((post) => !post.featured).slice(0, 6);

    return {
      allPosts: posts,
      featuredPosts,
      recentPosts,
      tags: uniqueTags,
    };
  },
});

// Keep existing single post query for blog detail pages
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Query blog posts by tag (optimized)
export const getPostsByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    return posts.filter((post) => post.tags.includes(args.tag));
  },
});

// Admin queries for managing blog posts
export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    author: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
    featured: v.boolean(),
    readingTime: v.number(),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("blogPosts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    readingTime: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
