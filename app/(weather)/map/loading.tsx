import { Skeleton } from '@/components/ui/skeleton';

export default function MapLoading() {
  return (
    <div className="py-4 space-y-4">
      <div>
        <Skeleton className="h-7 w-40 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="rounded-2xl" style={{ height: 'calc(100vh - 240px)', minHeight: '400px' }} />
    </div>
  );
}
