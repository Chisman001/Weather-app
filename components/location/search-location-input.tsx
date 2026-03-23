'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchLocations } from '@/lib/api/weather-client';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { logError } from '@/lib/logger';
import type { GeocodingResult } from '@/types/weather';

export function SearchLocationInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const setSelectedLocation = usePreferencesStore((s) => s.setSelectedLocation);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(data.length > 0);
      } catch (err) {
        logError('SearchLocationInput', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(result: GeocodingResult) {
    const location = {
      city: result.name,
      lat: result.latitude,
      lon: result.longitude,
      country: result.country_code,
      timezone: result.timezone,
      admin1: result.admin1,
    };
    setSelectedLocation(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    const params = new URLSearchParams({
      lat: String(location.lat),
      lon: String(location.lon),
      city: location.city,
      country: location.country ?? '',
      timezone: location.timezone ?? 'UTC',
    });
    router.push(`/home?${params.toString()}`);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or location…"
          aria-label="Search for a location"
          className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          aria-label="Location search results"
          className="absolute top-full mt-1 w-full rounded-xl border border-border bg-popover shadow-lg z-50 overflow-hidden"
        >
          {results.map((r) => (
            <li key={r.id} role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
              >
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[r.admin1, r.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
