'use client';

import { MapPin, Wind } from 'lucide-react';
import { usePreferencesStore } from '@/lib/store/preferences-store';

const DEFAULT_LOCATION_NAME = 'Lagos, NG';

export function LocationHeader() {
  const selectedLocation = usePreferencesStore((s) => s.selectedLocation);
  const locationName = selectedLocation
    ? `${selectedLocation.city}${selectedLocation.country ? `, ${selectedLocation.country}` : ''}`
    : DEFAULT_LOCATION_NAME;

  return (
    <div className="flex items-center gap-1.5">
      <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium text-foreground truncate max-w-[180px]">
        {locationName}
      </span>
    </div>
  );
}
