import { Sun, Wind, Droplets, Eye, Gauge, Umbrella, Sunrise, Sunset } from 'lucide-react';
import { MetricBadge } from '@/components/weather/metric-badge';
import { formatTemperature, formatWindSpeed, getUvIndexLabel, getVisibilityLabel } from '@/lib/weather/units';
import { formatTime } from '@/lib/weather/time';
import type { CurrentConditions, Location, TemperatureUnit, WindSpeedUnit } from '@/types/weather';

interface WeatherHighlightsProps {
  conditions: CurrentConditions;
  location: Location;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
}

export function WeatherHighlights({
  conditions,
  location,
  temperatureUnit,
  windSpeedUnit,
}: WeatherHighlightsProps) {
  const uvInfo = getUvIndexLabel(conditions.uvIndex);
  const visLabel = getVisibilityLabel(conditions.visibility);

  return (
    <section aria-label="Today's weather highlights">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Today&apos;s Highlights
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricBadge
          icon={<Sun className="h-4 w-4" />}
          label="UV Index"
          value={String(Math.round(conditions.uvIndex))}
          subValue={uvInfo.label}
        />
        <MetricBadge
          icon={<Wind className="h-4 w-4" />}
          label="Wind Speed"
          value={formatWindSpeed(conditions.windSpeed, windSpeedUnit)}
        />
        <MetricBadge
          icon={<Droplets className="h-4 w-4" />}
          label="Humidity"
          value={`${conditions.humidity}%`}
        />
        <MetricBadge
          icon={<Eye className="h-4 w-4" />}
          label="Visibility"
          value={`${(conditions.visibility / 1000).toFixed(1)} km`}
          subValue={visLabel}
        />
        <MetricBadge
          icon={<Gauge className="h-4 w-4" />}
          label="Pressure"
          value={`${Math.round(conditions.pressure)} hPa`}
        />
        <MetricBadge
          icon={<Umbrella className="h-4 w-4" />}
          label="Precipitation"
          value={`${conditions.precipitation} mm`}
        />
        <MetricBadge
          icon={<Sunrise className="h-4 w-4" />}
          label="Sunrise"
          value={formatTime(conditions.sunrise, location.timezone)}
        />
        <MetricBadge
          icon={<Sunset className="h-4 w-4" />}
          label="Sunset"
          value={formatTime(conditions.sunset, location.timezone)}
        />
        <MetricBadge
          icon={<Sun className="h-4 w-4" />}
          label="Feels Like"
          value={formatTemperature(conditions.feelsLike, temperatureUnit)}
        />
      </div>
    </section>
  );
}
