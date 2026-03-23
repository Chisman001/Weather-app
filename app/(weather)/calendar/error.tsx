'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';
import { ErrorState } from '@/components/weather/error-state';

export default function CalendarError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logError('calendar-page', error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState title="Calendar unavailable" message="Could not load forecast calendar." onRetry={reset} />
    </div>
  );
}
