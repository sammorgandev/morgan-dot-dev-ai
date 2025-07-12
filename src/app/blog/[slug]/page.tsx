import { ThemeToggle } from "@/components/default-view/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, User, Tag, Star } from "lucide-react";
import Link from "next/link";
import { preloadBlogPost } from "@/lib/data-loading";
import { preloadedQueryResult } from "convex/nextjs";
import { notFound } from "next/navigation";

interface BlogPostDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostDetailPageProps) {
  const preloadedPost = await preloadBlogPost(params.slug);

  // Get the post data using preloadedQueryResult
  const post = preloadedQueryResult(preloadedPost);

  if (!post) {
    notFound();
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      <main className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Blog Post */}
        <article>
          <Card className="p-8">
            <div className="space-y-6">
              {/* Post Header */}
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
                  {post.featured && (
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      Featured
                    </div>
                  )}
                </div>

                <h1 className="text-4xl font-bold leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Post Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          </Card>
        </article>
      </main>
    </div>
  );
}

// Not found page component
export function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
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

      <main className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </Card>
      </main>
    </div>
  );
}
