import { Octokit } from "@octokit/rest";

interface GeneratedFile {
  filename: string;
  content: string;
  language: string;
}

interface GitHubSyncOptions {
  owner?: string;
  repo?: string;
  branch?: string;
}

export class GitHubSyncError extends Error {
  constructor(
    message: string,
    public _cause?: Error
  ) {
    super(message);
    this.name = "GitHubSyncError";
  }
}

export interface SyncResult {
  success: boolean;
  localUrl?: string;
  commitSha?: string;
  error?: string;
}

export async function syncGeneratedSite(
  projectId: string,
  files: GeneratedFile[],
  options: GitHubSyncOptions = {}
): Promise<SyncResult> {
  const {
    owner = "sammorgan",
    repo = "morgan-dot-dev",
    branch = "main",
  } = options;

  // Check for required environment variables
  if (!process.env.GITHUB_TOKEN) {
    return {
      success: false,
      error: "GITHUB_TOKEN environment variable is required",
    };
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // Get latest commit SHA
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: 1,
    });

    if (commits.length === 0) {
      throw new GitHubSyncError("No commits found in repository");
    }

    const latestCommitSHA = commits[0].sha;

    // Create tree with new files
    const tree = files.map((file) => ({
      path: `src/generated/${projectId}/${file.filename}`,
      mode: "100644" as const,
      type: "blob" as const,
      content: file.content,
    }));

    // Create new tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: latestCommitSHA,
    });

    // Create commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: `Generated site: ${projectId}`,
      tree: newTree.sha,
      parents: [latestCommitSHA],
    });

    // Update branch reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return {
      success: true,
      localUrl: `/generated/${projectId}`,
      commitSha: newCommit.sha,
    };
  } catch (error) {
    console.error("GitHub sync error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteGeneratedSite(
  projectId: string,
  options: GitHubSyncOptions = {}
): Promise<SyncResult> {
  const {
    owner = "sammorgan",
    repo = "morgan-dot-dev",
    branch = "main",
  } = options;

  if (!process.env.GITHUB_TOKEN) {
    return {
      success: false,
      error: "GITHUB_TOKEN environment variable is required",
    };
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // Get latest commit SHA
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: 1,
    });

    const latestCommitSHA = commits[0].sha;

    // Get current tree
    const { data: currentCommit } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSHA,
    });

    const { data: currentTree } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: currentCommit.tree.sha,
      recursive: "true",
    });

    // Filter out files from the target directory
    const filteredTree = currentTree.tree.filter(
      (item) => !item.path?.startsWith(`src/generated/${projectId}/`)
    );

    // Create new tree without the generated files
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      tree: filteredTree.map((item) => ({
        path: item.path!,
        mode: item.mode as "100644" | "100755" | "040000" | "160000" | "120000",
        type: item.type as "blob" | "tree" | "commit",
        sha: item.sha,
      })),
    });

    // Create commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: `Remove generated site: ${projectId}`,
      tree: newTree.sha,
      parents: [latestCommitSHA],
    });

    // Update branch reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return {
      success: true,
      commitSha: newCommit.sha,
    };
  } catch (error) {
    console.error("GitHub delete error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function checkDeploymentStatus(
  projectId: string,
  maxRetries: number = 30,
  retryInterval: number = 2000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/generated/${projectId}`,
        {
          method: "HEAD",
        }
      );

      if (response.ok) {
        return true;
      }
    } catch {
      // Continue retrying
    }

    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }

  return false;
}
