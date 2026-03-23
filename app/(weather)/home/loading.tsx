import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="space-y-6 py-4">
      <Skeleton className="h-56 rounded-2xl" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 min-w-[72px] rounded-xl" />
        ))}
      </div>
      <div>
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
}
