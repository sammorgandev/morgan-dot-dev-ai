import { ThemeToggle } from "@/components/default-view/theme-toggle";
import Link from "next/link";
import {
  BlogPostSkeletonGrid,
  BlogPostSkeletonList,
} from "@/components/loading/blog-post-skeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="flex justify-between w-full top-0 right-0 p-6">
        <div className="text-md font-semibold flex gap-4">
          <Link
            href="/"
            className="hover:scale-105 transition-all duration-200"
          >
            Home
          </Link>
          <Link
            href="/resume"
            className="hover:scale-105 transition-all duration-200"
          >
            Resume
          </Link>
          <Link
            href="/projects"
            className="hover:scale-105 transition-all duration-200"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="hover:scale-105 transition-all duration-200 text-primary"
          >
            Blog
          </Link>
        </div>
        <ThemeToggle />
      </header>

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
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Featured Posts
          </h2>
          <BlogPostSkeletonGrid />
        </div>

        {/* Recent Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BlogPostSkeletonList />
          </div>
        </div>

        {/* All Posts Archive */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">All Posts</h2>
          <BlogPostSkeletonList />
        </div>

        {/* Tags Cloud */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Topics</h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-16" />
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
