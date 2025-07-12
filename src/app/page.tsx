"use client";

import { ProfileSection } from "@/components/default-view/profile-section";
import { DemoViewer } from "@/components/generated-view/demo-viewer";
import { PromptForm } from "@/components/default-view/prompt-form";
import { useAppStore } from "@/lib/store";
import Header from "@/components/Header";

export default function Home() {
  const { showDemo } = useAppStore();

  // Show demo viewer if available
  if (showDemo) {
    return <DemoViewer />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-background to-muted/20">
      <Header />

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
