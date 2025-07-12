"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Star,
  User,
  Tag,
  ArrowRight,
  Code,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "./utils";
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
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          Featured Posts
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredPosts.map((post) => (
            <Card
              key={post._id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} min read
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" className="mt-4 group" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <Card
              key={post._id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Posts Archive */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">All Posts</h2>
        <div className="space-y-4">
          {allPosts.map((post) => (
            <Card
              key={post._id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min read
                    </span>
                    {post.featured && (
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="h-3 w-3 fill-primary" />
                        Featured
                      </span>
                    )}
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm mb-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          Topics
        </h2>
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
