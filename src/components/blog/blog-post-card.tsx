import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { TagsList } from "@/components/ui/tags-list";
import { formatDate } from "@/app/blog/utils";

interface BlogPostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt: string;
    author: string;
    publishedAt?: string | number;
    createdAt: string | number;
    readingTime: number;
    tags: string[];
    slug: string;
    featured?: boolean;
  };
  variant?: "featured" | "recent" | "archive";
}

export function BlogPostCard({ post, variant = "recent" }: BlogPostCardProps) {
  const isFeatured = variant === "featured";
  const isRecent = variant === "recent";
  const isArchive = variant === "archive";

  const publishDate = formatDate(
    Number(post.publishedAt) || Number(post.createdAt)
  );

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Archive Layout */}
        {isArchive && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {publishDate}
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

              <TagsList tags={post.tags} variant="secondary" size="sm" />
            </div>

            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Featured and Recent Layout */}
        {!isArchive && (
          <>
            {/* Metadata */}
            <div
              className={`flex items-center gap-3 ${
                isRecent ? "text-xs" : "text-sm"
              } text-muted-foreground`}
            >
              {isFeatured && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className={isRecent ? "h-3 w-3" : "h-4 w-4"} />
                {publishDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className={isRecent ? "h-3 w-3" : "h-4 w-4"} />
                {post.readingTime} min read
              </span>
            </div>

            {/* Title */}
            <Link href={`/blog/${post.slug}`}>
              <h3
                className={`font-semibold hover:text-primary transition-colors cursor-pointer ${
                  isFeatured ? "text-xl" : "text-lg line-clamp-2"
                }`}
              >
                {post.title}
              </h3>
            </Link>

            {/* Excerpt */}
            <p
              className={`text-muted-foreground ${
                isFeatured ? "leading-relaxed" : "text-sm line-clamp-3"
              }`}
            >
              {post.excerpt}
            </p>

            {/* Tags */}
            <TagsList
              tags={post.tags}
              maxVisible={isRecent ? 3 : undefined}
              variant={isFeatured ? "secondary" : "outline"}
              size={isRecent ? "sm" : "default"}
              showIcon={isFeatured}
            />

            {/* Read More Button - Only for Featured */}
            {isFeatured && (
              <Button variant="outline" className="mt-4 group" asChild>
                <Link href={`/blog/${post.slug}`}>
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
