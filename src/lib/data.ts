import { api } from "../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";

// Blog post data fetching functions
export async function getBlogPosts() {
  try {
    const posts = await fetchQuery(api.blogPosts.getAllPosts);
    return posts || [];
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function getFeaturedBlogPosts() {
  try {
    const posts = await fetchQuery(api.blogPosts.getFeaturedPosts);
    return posts || [];
  } catch (error) {
    console.error("Failed to fetch featured blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await fetchQuery(api.blogPosts.getPostBySlug, { slug });
    return post;
  } catch (error) {
    console.error("Failed to fetch blog post by slug:", error);
    return null;
  }
}

export async function getBlogTags() {
  try {
    const tags = await fetchQuery(api.blogPosts.getAllTags);
    return tags || [];
  } catch (error) {
    console.error("Failed to fetch blog tags:", error);
    return [];
  }
}

// Portfolio project data fetching functions
export async function getPortfolioProjects() {
  try {
    const projects = await fetchQuery(api.portfolioProjects.getAllProjects);
    return projects || [];
  } catch (error) {
    console.error("Failed to fetch portfolio projects:", error);
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const projects = await fetchQuery(
      api.portfolioProjects.getFeaturedProjects
    );
    return projects || [];
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
    return [];
  }
}

export async function getProjectById(id: Id<"portfolioProjects">) {
  try {
    const project = await fetchQuery(api.portfolioProjects.getById, { id });
    return project;
  } catch (error) {
    console.error("Failed to fetch project by id:", error);
    return null;
  }
}

export async function getProjectsByStatus(
  status: "completed" | "in_progress" | "archived"
) {
  try {
    const projects = await fetchQuery(
      api.portfolioProjects.getProjectsByStatus,
      { status }
    );
    return projects || [];
  } catch (error) {
    console.error("Failed to fetch projects by status:", error);
    return [];
  }
}
