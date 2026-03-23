'use client';

import { MapPin, Check, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { DEFAULT_LOCATION } from '@/lib/weather/default-location';
import { cn } from '@/lib/ui/utils';
import type { Location } from '@/types/weather';

const PRESET_LOCATIONS: Location[] = [
  DEFAULT_LOCATION,
  { city: 'London', lat: 51.5074, lon: -0.1278, country: 'GB', timezone: 'Europe/London' },
  { city: 'New York', lat: 40.7128, lon: -74.006, country: 'US', timezone: 'America/New_York' },
  { city: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP', timezone: 'Asia/Tokyo' },
  { city: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'AE', timezone: 'Asia/Dubai' },
  { city: 'Nairobi', lat: -1.2921, lon: 36.8219, country: 'KE', timezone: 'Africa/Nairobi' },
];

export function SavedLocationsList() {
  const { selectedLocation, setSelectedLocation } = usePreferencesStore();
  const router = useRouter();

  const isSelected = (loc: Location) =>
    selectedLocation?.city === loc.city && selectedLocation?.country === loc.country;

  function handleSelect(loc: Location) {
    setSelectedLocation(loc);
    const params = new URLSearchParams({
      lat: String(loc.lat),
      lon: String(loc.lon),
      city: loc.city,
      country: loc.country ?? '',
      timezone: loc.timezone ?? 'UTC',
    });
    router.push(`/home?${params.toString()}`);
  }

  return (
    <section aria-label="Saved locations">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
        <Star className="h-4 w-4" />
        Popular Locations
      </h2>
      <ul className="space-y-2">
        {PRESET_LOCATIONS.map((loc) => {
          const active = isSelected(loc);
          return (
            <li key={`${loc.city}-${loc.country}`}>
              <button
                type="button"
                onClick={() => handleSelect(loc)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                  active
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-card hover:bg-muted/50 text-foreground'
                )}
                aria-pressed={active}
              >
                <MapPin className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{loc.city}</p>
                  <p className="text-xs text-muted-foreground">{loc.country} · {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}</p>
                </div>
                {active && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
