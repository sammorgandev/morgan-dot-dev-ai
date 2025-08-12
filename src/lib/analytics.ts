// Web Vitals and Performance Monitoring
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

// Track web vitals for performance monitoring
export function trackWebVitals() {
  onCLS(console.log);
  onFCP(console.log);
  onINP(console.log); // INP replaced FID
  onLCP(console.log);
  onTTFB(console.log);
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track API call performance
  trackApiCall(endpoint: string, duration: number) {
    const key = `api_${endpoint}`;
    this.metrics.set(key, duration);

    // Log slow API calls
    if (duration > 1000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
    }
  }

  // Track component render performance
  trackComponentRender(componentName: string, duration: number) {
    const key = `component_${componentName}`;
    this.metrics.set(key, duration);

    // Log slow component renders
    if (duration > 16) {
      // 16ms for 60fps
      console.warn(
        `Slow component render: ${componentName} took ${duration}ms`
      );
    }
  }

  // Track user interactions
  trackUserInteraction(action: string, target: string) {
    const timestamp = Date.now();
    const key = `interaction_${action}_${target}`;
    this.metrics.set(key, timestamp);

    // Log user interactions in development
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      console.log(`User interaction: ${action} on ${target}`);
    }
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
  }
}

// Error boundary monitoring
export function trackError(error: Error, errorInfo: Record<string, unknown>) {
  console.error("Application error:", error);
  console.error("Error info:", errorInfo);

  // In production, you would send this to an error tracking service
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    // Send to error tracking service (e.g., Sentry, LogRocket)
  }
}

// Performance hooks for React components
export function usePerformanceTracking(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();

  return {
    trackRender: (duration: number) => {
      monitor.trackComponentRender(componentName, duration);
    },
    trackInteraction: (action: string, target: string) => {
      monitor.trackUserInteraction(action, target);
    },
  };
}

// Bundle size monitoring
export function trackBundleSize() {
  if (typeof window !== "undefined" && "performance" in window) {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const bundleSize = navigation.transferSize;

    console.log(`Bundle size: ${(bundleSize / 1024).toFixed(2)} KB`);

    // Warn about large bundle sizes
    if (bundleSize > 1000000) {
      // 1MB
      console.warn("Large bundle size detected:", bundleSize);
    }
  }
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if (typeof window !== "undefined" && "memory" in performance) {
    const memory = (
      performance as {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    const usage = {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };

    console.log("Memory usage:", usage);

    // Warn about high memory usage
    if (usage.used / usage.limit > 0.8) {
      console.warn("High memory usage detected:", usage);
    }
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window !== "undefined") {
    // Track web vitals
    trackWebVitals();

    // Track bundle size
    trackBundleSize();

    // Monitor memory usage periodically
    setInterval(trackMemoryUsage, 30000); // Every 30 seconds

    // Track page load performance
    window.addEventListener("load", () => {
      const loadTime = performance.now();
      console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
    });
  }
}
