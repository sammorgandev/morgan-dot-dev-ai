import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Optimized data loading functions using preloadQuery
export async function preloadBlogData() {
  return await preloadQuery(api.blogPosts.getBlogData);
}

export async function preloadPortfolioData() {
  return await preloadQuery(api.portfolioProjects.getPortfolioData);
}

export async function preloadBlogPost(slug: string) {
  return await preloadQuery(api.blogPosts.getPostBySlug, { slug });
}

export async function preloadProject(id: Id<"portfolioProjects">) {
  return await preloadQuery(api.portfolioProjects.getById, { id });
}

// Parallel data loading for pages that need both blog and portfolio data
export async function preloadHomepageData() {
  const [blogData, portfolioData] = await Promise.all([
    preloadBlogData(),
    preloadPortfolioData(),
  ]);

  return {
    blogData,
    portfolioData,
  };
}
