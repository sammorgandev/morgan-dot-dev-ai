"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { Star, Code } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/projects/project-card";
import { api } from "../../../convex/_generated/api";

interface ProjectPageContentProps {
  preloadedPortfolioData: Preloaded<
    typeof api.portfolioProjects.getPortfolioData
  >;
}

export function ProjectPageContent({
  preloadedPortfolioData,
}: ProjectPageContentProps) {
  const portfolioData = usePreloadedQuery(preloadedPortfolioData);
  const { featuredProjects, allProjects } = portfolioData;

  return (
    <div className="space-y-12">
      {/* Featured Projects */}
      <div className="mb-12">
        <SectionHeader icon={Star} title="Featured Projects" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              variant="featured"
              showLongDescription={true}
            />
          ))}
        </div>
      </div>

      {/* All Projects */}
      <div>
        <SectionHeader icon={Code} title="All Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
