import { getPortfolioProjects } from "@/lib/data";
import { Card } from "../ui/card";
import { Calendar, Code, ExternalLink, Github, Link, Star } from "lucide-react";
import { getStatusColor, getStatusIcon } from "./utils";
import { Button } from "../ui/button";

export default async function AllProjects() {
  const projects = await getPortfolioProjects();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Code className="h-6 w-6 text-primary" />
        All Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project._id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <Link href={`/projects/${project._id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                    {project.title}
                  </h3>
                </Link>
                {project.featured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}
                >
                  {getStatusIcon(project.status)}
                  {project.status.replace("_", " ")}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {project.startDate}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-3 w-3" />
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
                      <ExternalLink className="h-3 w-3" />
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
