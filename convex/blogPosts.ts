import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query all published blog posts
export const getAllPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
  },
});

// Query blog posts by published date
export const getPostsByDate = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_published_at")
      .order("desc")
      .collect();
  },
});

// Query featured blog posts
export const getFeaturedPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
  },
});

// Query blog post by slug
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Query blog posts by tag
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

// Create a new blog post
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

// Update an existing blog post
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

// Delete a blog post
export const deletePost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get unique tags
export const getAllTags = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    const allTags = posts.flatMap((post) => post.tags);
    return [...new Set(allTags)].sort();
  },
});
