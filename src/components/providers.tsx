"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useMemo } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  const convex = useMemo(() => {
    if (!convexUrl) {
      // In CI/prerender, this may be undefined. Skip Convex client to avoid crashing builds.
      return null as unknown as ConvexReactClient;
    }
    try {
      return new ConvexReactClient(convexUrl);
    } catch {
      return null as unknown as ConvexReactClient;
    }
  }, [convexUrl]);

  const content = (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );

  // If Convex is not configured, render without the provider (safe for static/prerender paths).
  // Pages that actually use Convex hooks should ensure the env is set at runtime.
  // @ts-expect-error conditional provider when convex is null
  return convex ? <ConvexProvider client={convex}>{content}</ConvexProvider> : content;
}
