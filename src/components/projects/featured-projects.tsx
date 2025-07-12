import { getPortfolioProjects } from "@/lib/data";
import { Calendar, ExternalLink, Github, Link, Star } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default async function FeaturedProjects() {
  const projects = await getPortfolioProjects();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Star className="h-6 w-6 text-primary" />
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredProjects.map((project) => (
          <Card
            key={project._id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/projects/${project._id}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                      {project.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.startDate} - {project.endDate || "Present"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{project.description}</p>

              {project.longDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
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
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
