"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Code, Tag } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { api } from "../../../convex/_generated/api";

interface BlogPageContentProps {
  preloadedBlogData: Preloaded<typeof api.blogPosts.getBlogData>;
}

export function BlogPageContent({ preloadedBlogData }: BlogPageContentProps) {
  const blogData = usePreloadedQuery(preloadedBlogData);
  const { featuredPosts, recentPosts, allPosts, tags } = blogData;

  return (
    <div className="space-y-12">
      {/* Featured Posts */}
      <div className="mb-12">
        <SectionHeader icon={Star} title="Featured Posts" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredPosts.map((post) => (
            <BlogPostCard key={post._id} post={post} variant="featured" />
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <BlogPostCard key={post._id} post={post} variant="recent" />
          ))}
        </div>
      </div>

      {/* All Posts Archive */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">All Posts</h2>
        <div className="space-y-4">
          {allPosts.map((post) => (
            <BlogPostCard key={post._id} post={post} variant="archive" />
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div>
        <SectionHeader icon={Code} title="Topics" />
        <Card className="p-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
