import { Suspense } from 'react';
import { getCurrentConditions } from '@/lib/weather/get-current-weather';
import { getDailyForecast } from '@/lib/weather/get-daily-forecast';
import { getHourlyForecast } from '@/lib/weather/get-hourly-forecast';
import { DEFAULT_LOCATION } from '@/lib/weather/default-location';
import { CurrentConditionsCard } from '@/components/weather/current-conditions-card';
import { WeatherHighlights } from '@/components/weather/weather-highlights';
import { DailyForecastList } from '@/components/weather/daily-forecast-list';
import { HourlyForecastStrip } from '@/components/weather/hourly-forecast-strip';
import { MiniWeatherMap } from '@/components/weather/mini-weather-map';
import { Skeleton } from '@/components/ui/skeleton';
import type { Location } from '@/types/weather';

export const dynamic = 'force-dynamic';

interface HomePageSearchParams {
  lat?: string;
  lon?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

function resolveLocation(sp: HomePageSearchParams): Location {
  if (sp.lat && sp.lon && sp.city) {
    const lat = parseFloat(sp.lat);
    const lon = parseFloat(sp.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      return {
        city: sp.city,
        lat,
        lon,
        country: sp.country ?? '',
        timezone: sp.timezone ?? 'UTC',
      };
    }
  }
  return DEFAULT_LOCATION;
}

async function WeatherContent({ searchParams }: { searchParams: Promise<HomePageSearchParams> }) {
  const sp = await searchParams;
  const location = resolveLocation(sp);

  const [current, daily, hourly] = await Promise.all([
    getCurrentConditions(location),
    getDailyForecast(location),
    getHourlyForecast(location),
  ]);

  const temperatureUnit = 'celsius' as const;
  const windSpeedUnit = 'kmh' as const;

  return (
    <div className="space-y-6 py-4">
      <CurrentConditionsCard
        conditions={current}
        location={location}
        temperatureUnit={temperatureUnit}
        windSpeedUnit={windSpeedUnit}
      />
      <HourlyForecastStrip
        forecast={hourly}
        location={location}
        temperatureUnit={temperatureUnit}
      />
      <WeatherHighlights
        conditions={current}
        location={location}
        temperatureUnit={temperatureUnit}
        windSpeedUnit={windSpeedUnit}
      />
      <DailyForecastList
        forecast={daily}
        location={location}
        temperatureUnit={temperatureUnit}
      />
      <MiniWeatherMap location={location} />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-6 py-4">
      <Skeleton className="h-56 rounded-2xl" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-18 rounded-xl shrink-0 min-w-[72px]" />
        ))}
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ searchParams }: { searchParams: Promise<HomePageSearchParams> }) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <WeatherContent searchParams={searchParams} />
    </Suspense>
  );
}
