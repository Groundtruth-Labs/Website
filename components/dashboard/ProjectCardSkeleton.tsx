import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="border border-slate-200 bg-white rounded p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-24 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3 w-16 mt-4" />
    </div>
  );
}
