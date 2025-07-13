import { ThemeToggle } from "@/components/default-view/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, User, Tag, Star } from "lucide-react";
import Link from "next/link";
import { preloadBlogPost } from "@/lib/data-loading";
import { preloadedQueryResult } from "convex/nextjs";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostDetailPageProps) {
  const { slug } = await params;
  const preloadedPost = await preloadBlogPost(slug);

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
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom styling for headings
                    h1({ children, ...props }) {
                      return (
                        <h1
                          className="text-3xl font-bold mt-8 mb-4 text-foreground"
                          {...props}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2({ children, ...props }) {
                      return (
                        <h2
                          className="text-2xl font-semibold mt-6 mb-3 text-foreground"
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3({ children, ...props }) {
                      return (
                        <h3
                          className="text-xl font-semibold mt-5 mb-2 text-foreground"
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    h4({ children, ...props }) {
                      return (
                        <h4
                          className="text-lg font-semibold mt-4 mb-2 text-foreground"
                          {...props}
                        >
                          {children}
                        </h4>
                      );
                    },
                    h5({ children, ...props }) {
                      return (
                        <h5
                          className="text-base font-semibold mt-3 mb-1 text-foreground"
                          {...props}
                        >
                          {children}
                        </h5>
                      );
                    },
                    h6({ children, ...props }) {
                      return (
                        <h6
                          className="text-sm font-semibold mt-3 mb-1 text-foreground"
                          {...props}
                        >
                          {children}
                        </h6>
                      );
                    },
                    // Custom styling for paragraphs
                    p({ children, ...props }) {
                      return (
                        <p
                          className="text-base leading-7 mb-4 text-foreground"
                          {...props}
                        >
                          {children}
                        </p>
                      );
                    },
                    // Custom styling for lists
                    ul({ children, ...props }) {
                      return (
                        <ul
                          className="list-disc list-outside ml-6 mb-4 space-y-2"
                          {...props}
                        >
                          {children}
                        </ul>
                      );
                    },
                    ol({ children, ...props }) {
                      return (
                        <ol
                          className="list-decimal list-outside ml-6 mb-4 space-y-2"
                          {...props}
                        >
                          {children}
                        </ol>
                      );
                    },
                    li({ children, ...props }) {
                      return (
                        <li className="text-base leading-7" {...props}>
                          {children}
                        </li>
                      );
                    },
                    // Custom styling for links
                    a({ children, href, ...props }) {
                      return (
                        <a
                          href={href}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },
                    // Custom styling for emphasis
                    strong({ children, ...props }) {
                      return (
                        <strong
                          className="font-semibold text-foreground"
                          {...props}
                        >
                          {children}
                        </strong>
                      );
                    },
                    em({ children, ...props }) {
                      return (
                        <em className="italic text-foreground" {...props}>
                          {children}
                        </em>
                      );
                    },
                    // Custom styling for code blocks
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;

                      if (isInline) {
                        return (
                          <code
                            className="px-1 py-0.5 rounded bg-muted text-sm font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      return (
                        <pre className="overflow-x-auto p-4 rounded-lg bg-muted mb-4">
                          <code
                            className={`${className} font-mono text-sm`}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    // Custom styling for blockquotes
                    blockquote({ children, ...props }) {
                      return (
                        <blockquote
                          className="border-l-4 border-primary pl-6 italic text-muted-foreground mb-4"
                          {...props}
                        >
                          {children}
                        </blockquote>
                      );
                    },
                    // Custom styling for horizontal rules
                    hr({ ...props }) {
                      return (
                        <hr
                          className="border-t border-border my-8"
                          {...props}
                        />
                      );
                    },
                    // Custom styling for tables
                    table({ children, ...props }) {
                      return (
                        <div className="overflow-x-auto mb-4">
                          <table
                            className="min-w-full border-collapse border border-border"
                            {...props}
                          >
                            {children}
                          </table>
                        </div>
                      );
                    },
                    th({ children, ...props }) {
                      return (
                        <th
                          className="border border-border bg-muted px-4 py-2 text-left font-medium"
                          {...props}
                        >
                          {children}
                        </th>
                      );
                    },
                    td({ children, ...props }) {
                      return (
                        <td
                          className="border border-border px-4 py-2"
                          {...props}
                        >
                          {children}
                        </td>
                      );
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </Card>
        </article>
      </main>
    </div>
  );
}
