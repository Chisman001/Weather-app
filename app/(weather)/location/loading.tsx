import { Skeleton } from '@/components/ui/skeleton';

export default function LocationLoading() {
  return (
    <div className="py-4 space-y-6">
      <div>
        <Skeleton className="h-7 w-32 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-12 rounded-xl" />
      <div>
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
