import { Suspense } from "react";
import {
  BlogPostSkeletonGrid,
  BlogPostSkeletonList,
} from "@/components/loading/blog-post-skeleton";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { preloadBlogData } from "@/lib/data-loading";
import { BlogPageContent } from "./blog-page-content";

export default async function BlogPage() {
  const preloadedBlogData = await preloadBlogData();

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

        {/* Blog Content with Preloaded Data */}
        <Suspense
          fallback={
            <div className="space-y-12">
              <BlogPostSkeletonGrid />
              <BlogPostSkeletonList />
              <BlogPostSkeletonList />
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
            </div>
          }
        >
          <BlogPageContent preloadedBlogData={preloadedBlogData} />
        </Suspense>
      </main>
    </div>
  );
}
