import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-4" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="flex gap-3 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </Card>
  );
}

export function ProjectSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProjectSkeleton />
      <ProjectSkeleton />
    </div>
  );
}

export function ProjectSkeletonSmall() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="h-12 w-full" />

        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-10" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
}

export function ProjectSkeletonSmallGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProjectSkeletonSmall key={index} />
      ))}
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3 mb-6" />

            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="lg:w-80">
            <Skeleton className="w-full h-48 lg:h-64" />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    </div>
  );
}
