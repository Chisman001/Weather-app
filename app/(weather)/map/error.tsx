'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';
import { ErrorState } from '@/components/weather/error-state';

export default function MapError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logError('map-page', error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        title="Map unavailable"
        message="The weather map could not be loaded. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
