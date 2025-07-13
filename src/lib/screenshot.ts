import puppeteer from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  timeout?: number;
  delay?: number;
}

export async function captureScreenshot(
  url: string,
  options: ScreenshotOptions = {}
): Promise<Blob> {
  const { width = 1200, height = 800, timeout = 30000, delay = 2000 } = options;

  let browser;
  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width, height });

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout,
    });

    // Wait for any animations or dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Take screenshot as buffer
    const screenshot = await page.screenshot({
      type: "png",
      encoding: "binary",
      fullPage: false,
    });

    await browser.close();

    // Convert buffer to Blob
    return new Blob([screenshot], { type: "image/png" });
  } catch (error) {
    if (browser) {
      await browser.close();
    }

    console.error("Screenshot capture failed:", error);
    throw new Error(
      `Failed to capture screenshot: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function captureScreenshotWithRetry(
  url: string,
  options: ScreenshotOptions = {},
  maxRetries: number = 3
): Promise<Blob> {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await captureScreenshot(url, options);
    } catch (error) {
      lastError = error;
      console.warn(`Screenshot attempt ${i + 1} failed:`, error);

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}

// Helper function to upload screenshot to Convex storage
export async function uploadScreenshotToConvex(
  blob: Blob,
  projectId: Id<"projects">,
  convexUrl: string
): Promise<Id<"_storage">> {
  const convex = new ConvexHttpClient(convexUrl);

  try {
    // Step 1: Generate upload URL
    const postUrl = await convex.mutation(
      api.projects.generateScreenshotUploadUrl,
      {}
    );

    // Step 2: Upload the blob to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "image/png" },
      body: blob,
    });

    if (!result.ok) {
      throw new Error(`Upload failed with status: ${result.status}`);
    }

    const { storageId } = await result.json();

    // Step 3: Save the storage ID to the project
    await convex.mutation(api.projects.updateProjectScreenshot, {
      projectId,
      screenshotStorageId: storageId,
    });

    return storageId;
  } catch (error) {
    console.error("Failed to upload screenshot to Convex:", error);
    throw error;
  }
}
