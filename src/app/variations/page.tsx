import { Suspense } from "react";
import Header from "@/components/Header";
import { preloadVariationsData } from "@/lib/data-loading";
import { VariationsPageContent } from "./variations-page-content";

export default async function VariationsPage() {
  const preloadedVariationsData = await preloadVariationsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Site Variations</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of generated sites from the v0 platform, showcasing
            different approaches and designs
          </p>
        </div>

        {/* Variations Content with Preloaded Data */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          }
        >
          <VariationsPageContent
            preloadedVariationsData={preloadedVariationsData}
          />
        </Suspense>
      </main>
    </div>
  );
}
