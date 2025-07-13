"use client";

import { usePreloadedQuery, Preloaded, useQuery } from "convex/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, MessageSquare } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface VariationsPageContentProps {
  preloadedVariationsData: Preloaded<typeof api.projects.getProjectsWithDemos>;
}

type ProjectWithDemos = {
  _id: Id<"projects">;
  _creationTime: number;
  prompt: string;
  demoUrl?: string;
  chatId?: string;
  createdAt: number;
  updatedAt?: number;
  status?: "active" | "error" | "completed";
  screenshotStorageId?: Id<"_storage">;
};

function ProjectCard({ project }: { project: ProjectWithDemos }) {
  // Get screenshot URL if available
  const screenshotUrl = useQuery(
    api.projects.getScreenshotUrl,
    project.screenshotStorageId ? { projectId: project._id } : "skip"
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Screenshot Preview */}
      <div className="relative h-48 bg-muted">
        {screenshotUrl ? (
          <img
            src={screenshotUrl}
            alt={`Preview of ${project.prompt}`}
            className="w-full h-full object-cover"
          />
        ) : project.demoUrl ? (
          <iframe
            src={project.demoUrl}
            className="w-full h-full border-0 pointer-events-none"
            sandbox="allow-same-origin"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant={
              project.status === "completed"
                ? "default"
                : project.status === "error"
                  ? "destructive"
                  : "secondary"
            }
            className="text-xs"
          >
            {project.status || "active"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatTimeAgo(project.createdAt)}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <h3 className="font-medium text-sm mb-2 text-muted-foreground">
            Original Prompt:
          </h3>
          <p className="text-sm line-clamp-3 leading-relaxed">
            {project.prompt}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {project.demoUrl && (
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Site
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export function VariationsPageContent({
  preloadedVariationsData,
}: VariationsPageContentProps) {
  const projects = usePreloadedQuery(preloadedVariationsData);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No generated sites found yet.</p>
          <p className="text-sm">
            Sites will appear here once they&apos;re generated with the v0
            platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
