import { ThemeToggle } from "@/components/default-view/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPostNotFound() {
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
