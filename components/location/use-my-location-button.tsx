'use client';

import { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { logError } from '@/lib/logger';

type Status = 'idle' | 'requesting' | 'loading' | 'error';

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Location permission denied. Please allow access in your browser settings.';
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Your location is currently unavailable. Try again later.';
    case GeolocationPositionError.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'Unable to retrieve your location.';
  }
}

export function UseMyLocationButton() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const setSelectedLocation = usePreferencesStore((s) => s.setSelectedLocation);
  const router = useRouter();

  async function handleClick() {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('requesting');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus('loading');

        try {
          const res = await fetch(
            `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );

          if (!res.ok) {
            throw new Error(`Reverse geocode failed: ${res.status}`);
          }

          const data = (await res.json()) as {
            city: string;
            country: string;
            timezone: string;
          };

          const location = {
            city: data.city,
            lat: latitude,
            lon: longitude,
            country: data.country,
            timezone: data.timezone,
          };

          setSelectedLocation(location);

          const params = new URLSearchParams({
            lat: String(latitude),
            lon: String(longitude),
            city: data.city,
            country: data.country,
            timezone: data.timezone,
          });

          router.push(`/home?${params.toString()}`);
        } catch (err) {
          logError('UseMyLocationButton', err);
          setStatus('error');
          setErrorMessage('Could not look up your location. Please try again.');
        }
      },
      (err) => {
        logError('UseMyLocationButton', err, { code: err.code });
        setStatus('error');
        setErrorMessage(getGeolocationErrorMessage(err.code));
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }

  const isLoading = status === 'requesting' || status === 'loading';

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Use my current location"
        className="w-full flex items-center gap-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>
          {status === 'requesting' && 'Waiting for permission…'}
          {status === 'loading' && 'Detecting location…'}
          {(status === 'idle' || status === 'error') && 'Use my current location'}
        </span>
      </button>

      {status === 'error' && errorMessage && (
        <p
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
