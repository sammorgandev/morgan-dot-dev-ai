"use client";

import { ThemeToggle } from "@/components/default-view/theme-toggle";
import { ProfileSection } from "@/components/default-view/profile-section";
import { StatusMessages } from "@/components/default-view/status-messages";
import { DemoViewer } from "@/components/generated-view/demo-viewer";
import { PromptForm } from "@/components/default-view/prompt-form";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { showDemo, actionState } = useAppStore();

  // Show demo viewer if available
  if (showDemo && actionState?.success && actionState.data?.demo) {
    return <DemoViewer />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="absolute top-0 right-0 p-6">
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Profile Section */}
          <ProfileSection />

          {/* Status Messages */}
          <StatusMessages />

          {/* Prompt Form */}
          <PromptForm />

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Powered by v0 platform api • This site will be customized based on
              your prompt
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
