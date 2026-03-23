'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';
import { ErrorState } from '@/components/weather/error-state';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logError('home-page', error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState
        title="Could not load weather"
        message="We had trouble fetching your weather data. Check your connection and try again."
        onRetry={reset}
      />
    </div>
  );
}
