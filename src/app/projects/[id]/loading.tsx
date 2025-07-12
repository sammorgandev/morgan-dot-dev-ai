import { ThemeToggle } from "@/components/default-view/theme-toggle";
import Link from "next/link";
import { ProjectDetailSkeleton } from "@/components/loading/project-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetailLoading() {
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
            className="hover:scale-105 transition-all duration-200 text-primary"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="hover:scale-105 transition-all duration-200"
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
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <ProjectDetailSkeleton />
      </main>
    </div>
  );
}
