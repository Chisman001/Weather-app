import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarLoading() {
  return (
    <div className="py-4 space-y-4">
      <div>
        <Skeleton className="h-7 w-48 mb-1" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
