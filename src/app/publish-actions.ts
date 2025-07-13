"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { deploymentService } from "@/lib/deployment-service";

interface PublishActionState {
  success?: boolean;
  error?: string;
  data?: {
    deploymentUrl?: string;
    deploymentId?: string;
  };
}

export async function publishProject(
  prevState: PublishActionState,
  formData: FormData
): Promise<PublishActionState> {
  const projectId = formData.get("projectId");
  const chatId = formData.get("chatId");

  if (!projectId || typeof projectId !== "string") {
    return { error: "Project ID is required" };
  }

  if (!chatId || typeof chatId !== "string") {
    return { error: "Chat ID is required" };
  }

  try {
    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Get project files
    const projectData = await convex.query(api.projects.getProjectWithFiles, {
      projectId: projectId as Id<"projects">,
    });

    if (!projectData) {
      return { error: "Project not found" };
    }

    // Mark project as published in database
    await convex.mutation(api.projects.publishProject, {
      projectId: projectId as Id<"projects">,
    });

    // Create deployment using the new deployment service
    const deploymentResult = await deploymentService.createDeployment({
      projectId,
      chatId,
      files: projectData.files,
    });

    if (!deploymentResult.success) {
      // Mark deployment as failed
      await convex.mutation(api.projects.failDeployment, {
        projectId: projectId as Id<"projects">,
        error: deploymentResult.error || "Deployment failed",
      });

      return {
        error: deploymentResult.error || "Failed to create deployment",
      };
    }

    // Update project with deployment details
    await convex.mutation(api.projects.completeDeployment, {
      projectId: projectId as Id<"projects">,
      deploymentUrl: deploymentResult.deploymentUrl!,
      vercelDeploymentId: deploymentResult.vercelDeploymentId,
    });

    return {
      success: true,
      data: {
        deploymentUrl: deploymentResult.deploymentUrl,
        deploymentId: deploymentResult.vercelDeploymentId,
      },
    };
  } catch (error) {
    console.error("Error publishing project:", error);

    // Try to mark deployment as failed
    try {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await convex.mutation(api.projects.failDeployment, {
        projectId: projectId as Id<"projects">,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (logError) {
      console.error("Failed to log deployment failure:", logError);
    }

    return {
      error: error instanceof Error ? error.message : "Failed to publish project",
    };
  }
}

export async function checkDeploymentStatus(
  prevState: PublishActionState,
  formData: FormData
): Promise<PublishActionState> {
  const projectId = formData.get("projectId");
  const v0DeploymentId = formData.get("v0DeploymentId");
  const vercelDeploymentId = formData.get("vercelDeploymentId");

  if (!projectId || typeof projectId !== "string") {
    return { error: "Project ID is required" };
  }

  try {
    // Check deployment status
    const status = await deploymentService.getDeploymentStatus(
      v0DeploymentId as string,
      vercelDeploymentId as string
    );

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Update deployment status in database
    await convex.mutation(api.projects.updateDeploymentStatus, {
      projectId: projectId as Id<"projects">,
      status: status.status,
      deploymentUrl: status.url,
      error: status.error,
    });

    return {
      success: true,
      data: {
        deploymentUrl: status.url,
        deploymentId: vercelDeploymentId as string,
      },
    };
  } catch (error) {
    console.error("Error checking deployment status:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to check deployment status",
    };
  }
}

export async function getDeploymentLogs(
  prevState: PublishActionState,
  formData: FormData
): Promise<{ logs: string[]; error?: string }> {
  const v0DeploymentId = formData.get("v0DeploymentId");
  const vercelDeploymentId = formData.get("vercelDeploymentId");

  try {
    const logs = await deploymentService.getDeploymentLogs(
      v0DeploymentId as string,
      vercelDeploymentId as string
    );

    return { logs };
  } catch (error) {
    console.error("Error getting deployment logs:", error);
    return {
      logs: [],
      error: error instanceof Error ? error.message : "Failed to get deployment logs",
    };
  }
}