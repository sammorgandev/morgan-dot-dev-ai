import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <Skeleton className="h-8 w-3/4" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>

        <Skeleton className="h-10 w-24" />
      </div>
    </Card>
  );
}

export function BlogPostSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BlogPostSkeleton />
      <BlogPostSkeleton />
    </div>
  );
}

export function BlogPostSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <BlogPostSkeleton key={index} />
      ))}
    </div>
  );
}

export function BlogPostDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    </div>
  );
}
