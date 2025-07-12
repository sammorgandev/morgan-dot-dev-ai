import { Suspense } from "react";
import {
  ProjectSkeletonGrid,
  ProjectSkeletonSmallGrid,
} from "@/components/loading/project-skeleton";
import Header from "@/components/Header";
import { preloadPortfolioData } from "@/lib/data-loading";
import { ProjectPageContent } from "./project-page-content";

export default async function ProjectsPage() {
  const preloadedPortfolioData = await preloadPortfolioData();

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

        {/* Projects Content with Preloaded Data */}
        <Suspense
          fallback={
            <div className="space-y-12">
              <ProjectSkeletonGrid />
              <ProjectSkeletonSmallGrid />
            </div>
          }
        >
          <ProjectPageContent preloadedPortfolioData={preloadedPortfolioData} />
        </Suspense>
      </main>
    </div>
  );
}
