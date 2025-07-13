import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Calendar, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { preloadProject } from "@/lib/data-loading";
import { preloadedQueryResult } from "convex/nextjs";
import { notFound } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import { getStatusColor, getStatusIcon } from "@/components/projects/utils";
import Header from "@/components/Header";
import Image from "next/image";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const preloadedProject = await preloadProject(id as Id<"portfolioProjects">);
  const project = preloadedQueryResult(preloadedProject);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

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

        {/* Project Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                {project.featured && (
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}
                >
                  {getStatusIcon(project.status)}
                  {project.status.replace("_", " ")}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {project.startDate} - {project.endDate || "Present"}
                </span>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.githubUrl && (
                  <Button asChild>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {project.imageUrl && (
              <div className="lg:w-80">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 lg:h-64 object-cover rounded-lg"
                  width={320}
                  height={192}
                />
              </div>
            )}
          </div>
        </Card>

        {/* Project Details */}
        {project.longDescription && (
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Project Details</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {project.longDescription.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
