'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';
import { ErrorState } from '@/components/weather/error-state';

export default function LocationError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logError('location-page', error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState title="Location error" message="Could not load location data." onRetry={reset} />
    </div>
  );
}
