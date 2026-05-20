import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fieldCount?: number;
  className?: string;
}

export function FormSkeleton({ fieldCount = 4, className }: FormSkeletonProps) {
  return (
    <div className={className ?? "max-w-lg space-y-4"}>
      {Array.from({ length: fieldCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-9 w-32" />
    </div>
  );
}
