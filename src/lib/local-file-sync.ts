import fs from "fs/promises";
import path from "path";

interface GeneratedFile {
  filename: string;
  content: string;
  language: string;
}

export interface LocalSyncResult {
  success: boolean;
  localUrl?: string;
  error?: string;
  filesWritten?: string[];
}

export async function syncGeneratedSiteLocally(
  projectId: string,
  files: GeneratedFile[]
): Promise<LocalSyncResult> {
  console.log("🚀 syncGeneratedSiteLocally called:", {
    projectId,
    fileCount: files.length,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
  });

  // Run in development environment (when not on Vercel)
  const isDevelopment =
    process.env.NODE_ENV === "development" || !process.env.VERCEL;
  if (!isDevelopment) {
    console.log("❌ Local sync skipped - not in development environment");
    return {
      success: false,
      error: "Local sync only available in development environment",
    };
  }

  try {
    // Create the project directory
    const projectDir = path.join(process.cwd(), "src", "generated", projectId);

    // Ensure directory exists
    await fs.mkdir(projectDir, { recursive: true });

    const filesWritten: string[] = [];

    // Write each file
    for (const file of files) {
      const filePath = path.join(projectDir, file.filename);

      // Ensure subdirectories exist if filename includes paths
      const fileDir = path.dirname(filePath);
      if (fileDir !== projectDir) {
        await fs.mkdir(fileDir, { recursive: true });
      }

      // Write the file
      await fs.writeFile(filePath, file.content, "utf-8");
      filesWritten.push(file.filename);
    }

    console.log(`✅ Local sync complete for project ${projectId}:`);
    console.log(`   📂 ${projectDir}`);
    console.log(`   📄 Files: ${filesWritten.join(", ")}`);

    return {
      success: true,
      localUrl: `/generated/${projectId}`,
      filesWritten,
    };
  } catch (error) {
    console.error("❌ Local sync failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteGeneratedSiteLocally(
  projectId: string
): Promise<LocalSyncResult> {
  if (process.env.NODE_ENV !== "development") {
    return {
      success: false,
      error: "Local sync only available in development environment",
    };
  }

  try {
    const projectDir = path.join(process.cwd(), "src", "generated", projectId);

    // Check if directory exists
    try {
      await fs.access(projectDir);
    } catch {
      // Directory doesn't exist, consider it a success
      return { success: true };
    }

    // Remove the directory and all its contents
    await fs.rm(projectDir, { recursive: true, force: true });

    console.log(`🗑️ Deleted local project: ${projectDir}`);

    return { success: true };
  } catch (error) {
    console.error("❌ Local deletion failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
