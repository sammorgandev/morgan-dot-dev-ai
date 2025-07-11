"use client";

import { ThemeToggle } from "@/components/default-view/theme-toggle";
import { ProfileSection } from "@/components/default-view/profile-section";
import { DemoViewer } from "@/components/generated-view/demo-viewer";
import { PromptForm } from "@/components/default-view/prompt-form";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export default function Home() {
  const { showDemo } = useAppStore();

  // Show demo viewer if available
  if (showDemo) {
    return <DemoViewer />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="flex justify-between w-full  top-0 right-0 p-6">
        <div className="text-md font-semibold flex gap-4">
          <Link
            href="/"
            className="hover:scale-105 transition-all duration-200"
          >
            Resume
          </Link>
          <Link
            href="/"
            className="hover:scale-105 transition-all duration-200"
          >
            Projects
          </Link>
          <Link
            href="/"
            className="hover:scale-105 transition-all duration-200"
          >
            Blog
          </Link>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center  h-[calc(100vh-68px)] lg:flex-row max-w-6xl gap-6 lg:gap-12 m-6 mb-0 mt-0">
        {/* Profile Section */}
        <ProfileSection />

        {/* Prompt Form */}
        <PromptForm />
      </main>
    </div>
  );
}
