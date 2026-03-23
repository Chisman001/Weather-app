'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/logger';
import { ErrorState } from '@/components/weather/error-state';

export default function SettingsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logError('settings-page', error);
  }, [error]);

  return (
    <div className="py-12">
      <ErrorState title="Settings error" message="Could not load settings." onRetry={reset} />
    </div>
  );
}
