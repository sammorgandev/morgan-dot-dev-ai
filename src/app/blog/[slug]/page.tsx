import { ThemeToggle } from "@/components/default-view/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, User, Tag, Star } from "lucide-react";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

interface BlogPostDetailPageProps {
  params: {
    slug: string;
  };
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content: string) {
  return content.split("\n\n").map((paragraph, index) => {
    if (paragraph.startsWith("# ")) {
      return (
        <h1 key={index} className="text-3xl font-bold mb-6 mt-8">
          {paragraph.slice(2)}
        </h1>
      );
    }
    if (paragraph.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-semibold mb-4 mt-6">
          {paragraph.slice(3)}
        </h2>
      );
    }
    if (paragraph.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold mb-3 mt-4">
          {paragraph.slice(4)}
        </h3>
      );
    }
    if (paragraph.startsWith("```")) {
      const codeBlock = paragraph.slice(3, -3);
      return (
        <pre
          key={index}
          className="bg-muted p-4 rounded-lg overflow-x-auto my-4"
        >
          <code className="text-sm">{codeBlock}</code>
        </pre>
      );
    }
    if (paragraph.startsWith("- ")) {
      const listItems = paragraph
        .split("\n")
        .filter((item) => item.startsWith("- "));
      return (
        <ul key={index} className="list-disc pl-6 mb-4">
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="mb-2">
              {item.slice(2)}
            </li>
          ))}
        </ul>
      );
    }
    if (paragraph.match(/^\d+\. /)) {
      const listItems = paragraph
        .split("\n")
        .filter((item) => item.match(/^\d+\. /));
      return (
        <ol key={index} className="list-decimal pl-6 mb-4">
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="mb-2">
              {item.replace(/^\d+\. /, "")}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
        {paragraph}
      </p>
    );
  });
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

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

        {/* Post Header */}
        <Card className="p-8 mb-8">
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

            <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Post Content */}
        <Card className="p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {renderContent(post.content)}
          </div>
        </Card>
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
