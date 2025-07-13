"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConvexProvider, useQuery } from "convex/react";
import { ConvexReactClient } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Initialize Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function GeneratedSitePage() {
  return (
    <ConvexProvider client={convex}>
      <GeneratedSiteContent />
    </ConvexProvider>
  );
}

function GeneratedSiteContent() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);

  // Fetch project data from Convex
  const projectData = useQuery(api.projects.getProjectWithFiles, {
    projectId: projectId as Id<"projects">,
  });

  // Check if we have a filesystem-based component
  const [FilesystemComponent, setFilesystemComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadFilesystemComponent() {
      try {
        // Try to dynamically import the filesystem-based component
        const componentModule = await import(
          `../../../../generated/${projectId}/page`
        );
        setFilesystemComponent(() => componentModule.default);
      } catch {
        console.log("Filesystem component not found, using database fallback");
        setFilesystemComponent(null);
      }
    }

    if (projectId) {
      loadFilesystemComponent();
    }
  }, [projectId]);

  // Update deployment status when project data changes
  useEffect(() => {
    if (projectData?.project?.deploymentStatus) {
      setDeploymentStatus(projectData.project.deploymentStatus);
    }
  }, [projectData]);

  // Loading state
  if (!projectData) {
    return <LoadingState />;
  }

  // If we have a filesystem component, render it
  if (FilesystemComponent) {
    return <FilesystemComponent />;
  }

  // Handle deployment states
  if (deploymentStatus === "syncing" || deploymentStatus === "deploying") {
    return <DeploymentInProgressState projectData={projectData} />;
  }

  if (deploymentStatus === "failed") {
    return <DeploymentFailedState projectData={projectData} />;
  }

  // Error state
  if (!projectData.files || projectData.files.length === 0) {
    return <ErrorState error={null} projectData={projectData} />;
  }

  // For now, show a message that this is transitioning to the new system
  return <TransitionState projectData={projectData} />;
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading generated site...</p>
      </div>
    </div>
  );
}

function DeploymentInProgressState({
  projectData,
}: {
  projectData: {
    project?: { prompt?: string; demoUrl?: string; deploymentStatus?: string };
  };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Deploying Your Site
        </h1>
        <p className="text-gray-600 mb-6">
          {projectData.project?.deploymentStatus === "syncing"
            ? "Syncing files to repository..."
            : "Deploying to production..."}
        </p>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-700 mb-4">
            <strong>Style:</strong> {projectData.project?.prompt || "Unknown"}
          </p>
          <p className="text-sm text-gray-600">
            Your site is being deployed and will be available at this URL once
            complete. The v0 demo URL is still available for immediate preview.
          </p>
          {projectData.project?.demoUrl && (
            <a
              href={projectData.project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DeploymentFailedState({ projectData }: { projectData: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="text-red-500 mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Deployment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          There was an issue deploying your site. The v0 demo is still
          available.
        </p>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Style:</strong> {projectData.project?.prompt || "Unknown"}
          </p>
          {projectData.project?.deploymentError && (
            <p className="text-sm text-red-600 mb-4">
              <strong>Error:</strong> {projectData.project.deploymentError}
            </p>
          )}
          {projectData.project?.demoUrl && (
            <a
              href={projectData.project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  error,
  projectData,
}: {
  error: string | null;
  projectData: any;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Generated Site
        </h1>
        <p className="text-gray-600 mb-6">
          {error || "No files found for this project"}
        </p>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Project:</strong> {projectData.project?.prompt || "Unknown"}
          </p>
          {projectData.files && projectData.files.length > 0 && (
            <p className="text-sm text-gray-700">
              <strong>Files:</strong> {projectData.files.length} file(s) found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TransitionState({ projectData }: { projectData: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sam Morgan - Software Engineer
        </h1>
        <p className="text-xl text-gray-600 mb-6">Generated Site Preview</p>
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <p className="text-sm text-gray-700 mb-4">
            <strong>Style:</strong> {projectData.project?.prompt || "Unknown"}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            This site is being migrated to the new deployment system. For now,
            please use the v0 demo URL for the full experience.
          </p>
          {projectData.project?.demoUrl && (
            <a
              href={projectData.project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Generated Site
            </a>
          )}
        </div>
        <div className="text-left max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">About Sam Morgan</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Software Engineer at Bubble</p>
            <p>• Previously: soiheardmusic, Science4Data</p>
            <p>• Specializes in AI-powered applications</p>
            <p>• React, TypeScript, Next.js expert</p>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <a
              href="https://github.com/sammorgan"
              className="text-gray-600 hover:text-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/sammorgan"
              className="text-gray-600 hover:text-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="mailto:sam@sammorgan.dev"
              className="text-gray-600 hover:text-gray-800"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
