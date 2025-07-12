import { Suspense } from "react";
import {
  BlogPostSkeletonGrid,
  BlogPostSkeletonList,
} from "@/components/loading/blog-post-skeleton";
import Header from "@/components/Header";
import FeaturedPosts from "./featured-posts";
import RecentPosts from "./recent-posts";
import AllPosts from "./all-posts";
import { Card } from "@/components/ui/card";
import TagsCloud from "./tags-cloud";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on software engineering, AI, no-code development, and the
            intersection of technology and creativity
          </p>
        </div>

        {/* Featured Posts */}
        <Suspense fallback={<BlogPostSkeletonGrid />}>
          <FeaturedPosts />
        </Suspense>

        {/* Recent Posts */}
        <Suspense fallback={<BlogPostSkeletonList />}>
          <RecentPosts />
        </Suspense>

        {/* All Posts Archive */}
        <Suspense fallback={<BlogPostSkeletonList />}>
          <AllPosts />
        </Suspense>

        {/* Tags Cloud */}
        <Suspense
          fallback={
            <Card className="p-6">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-16 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            </Card>
          }
        >
          <TagsCloud />
        </Suspense>
      </main>
    </div>
  );
}
