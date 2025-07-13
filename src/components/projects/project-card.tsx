import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { TagsList } from "@/components/ui/tags-list";
import {
  MetadataDisplay,
  createDateRangeMetadata,
  createDateMetadata,
} from "@/components/ui/metadata-display";
import { getStatusColor, getStatusIcon } from "@/components/projects/utils";

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description: string;
    longDescription?: string;
    status: string;
    startDate: string;
    endDate?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
  };
  variant?: "featured" | "compact" | "list";
  showLongDescription?: boolean;
}

export function ProjectCard({
  project,
  variant = "compact",
  showLongDescription = false,
}: ProjectCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link href={`/projects/${project._id}`}>
              <h3
                className={`font-semibold hover:text-primary transition-colors cursor-pointer ${
                  isFeatured ? "text-xl mb-2" : "text-lg"
                }`}
              >
                {project.title}
              </h3>
            </Link>

            {/* Status and Date */}
            <div className="flex items-center gap-2 mb-3">
              <Badge
                className={`text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}
              >
                {getStatusIcon(project.status)}
                {project.status.replace("_", " ")}
              </Badge>

              {isFeatured ? (
                <MetadataDisplay
                  items={[
                    createDateRangeMetadata(project.startDate, project.endDate),
                  ]}
                  size="sm"
                />
              ) : (
                <MetadataDisplay
                  items={[createDateMetadata(project.startDate)]}
                  size="sm"
                />
              )}
            </div>
          </div>

          {/* Featured Star */}
          {!isFeatured && project.featured && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>

        {/* Description */}
        <p
          className={`text-muted-foreground ${
            isCompact ? "text-sm line-clamp-3" : ""
          }`}
        >
          {project.description}
        </p>

        {/* Long Description for Featured */}
        {isFeatured && project.longDescription && showLongDescription && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.longDescription}
          </p>
        )}

        {/* Technologies */}
        <TagsList
          tags={project.technologies}
          maxVisible={isCompact ? 4 : undefined}
          variant="secondary"
          size={isCompact ? "sm" : "default"}
        />

        {/* Action Buttons */}
        <div className={`flex gap-2 ${isFeatured ? "pt-2" : ""}`}>
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                {isFeatured ? "Code" : ""}
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {isFeatured ? "Live Demo" : ""}
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
