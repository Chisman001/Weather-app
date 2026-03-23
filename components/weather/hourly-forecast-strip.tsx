import { WeatherIcon } from '@/components/weather/weather-icon';
import { formatTemperature } from '@/lib/weather/units';
import { formatHour, getCurrentHourIndex } from '@/lib/weather/time';
import { cn } from '@/lib/ui/utils';
import type { HourlyForecast, Location, TemperatureUnit } from '@/types/weather';

interface HourlyForecastStripProps {
  forecast: HourlyForecast;
  location: Location;
  temperatureUnit: TemperatureUnit;
  hours?: number;
}

export function HourlyForecastStrip({
  forecast,
  location,
  temperatureUnit,
  hours = 24,
}: HourlyForecastStripProps) {
  const startIdx = Math.max(0, getCurrentHourIndex(forecast.time));
  const items = forecast.time.slice(startIdx, startIdx + hours);

  return (
    <section aria-label="Hourly forecast">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Hourly Forecast
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((time, i) => {
          const idx = startIdx + i;
          const isNow = i === 0;
          return (
            <div
              key={time}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl px-4 py-3 min-w-[72px] border',
                isNow
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-muted/50 transition-colors'
              )}
            >
              <span className={cn('text-xs font-medium', isNow ? 'text-primary-foreground' : 'text-muted-foreground')}>
                {isNow ? 'Now' : formatHour(time, location.timezone)}
              </span>
              <WeatherIcon
                code={forecast.weatherCode[idx]}
                isDay={true}
                size={20}
                className={isNow ? 'text-primary-foreground' : undefined}
              />
              <span className={cn('text-sm font-semibold', isNow ? 'text-primary-foreground' : 'text-foreground')}>
                {formatTemperature(forecast.temperature[idx], temperatureUnit)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
