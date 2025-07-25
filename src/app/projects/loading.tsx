import {
  ProjectSkeletonGrid,
  ProjectSkeletonSmallGrid,
} from "@/components/loading/project-skeleton";
import { Star, Code } from "lucide-react";
import Header from "@/components/Header";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I&apos;ve worked on, ranging from AI
            applications to no-code solutions
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Featured Projects
          </h2>
          <ProjectSkeletonGrid />
        </div>

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            All Projects
          </h2>
          <ProjectSkeletonSmallGrid />
        </div>
      </main>
    </div>
  );
}
