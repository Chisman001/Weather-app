import { Droplets } from 'lucide-react';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { formatTemperature } from '@/lib/weather/units';
import { formatWeekday, isToday } from '@/lib/weather/time';
import { cn } from '@/lib/ui/utils';
import type { DailyForecast, Location, TemperatureUnit } from '@/types/weather';

interface DailyForecastListProps {
  forecast: DailyForecast;
  location: Location;
  temperatureUnit: TemperatureUnit;
  limit?: number;
}

export function DailyForecastList({
  forecast,
  location,
  temperatureUnit,
  limit = 7,
}: DailyForecastListProps) {
  const days = forecast.time.slice(0, limit);

  return (
    <section aria-label="7-day forecast">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        {limit}-Day Forecast
      </h2>
      <ul className="space-y-2">
        {days.map((dateStr, i) => {
          const today = isToday(dateStr, location.timezone);
          return (
            <li
              key={dateStr}
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-3 border',
                today
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-card border-border hover:bg-muted/50 transition-colors'
              )}
            >
              <span
                className={cn(
                  'w-12 text-sm font-medium',
                  today ? 'text-primary font-semibold' : 'text-foreground'
                )}
              >
                {today ? 'Today' : formatWeekday(dateStr, location.timezone)}
              </span>

              <div className="flex items-center gap-1.5">
                <WeatherIcon
                  code={forecast.weatherCode[i]}
                  isDay={true}
                  size={20}
                />
              </div>

              {forecast.precipitationProbabilityMax[i] > 0 && (
                <span className="flex items-center gap-1 text-xs text-blue-500 w-12 justify-center">
                  <Droplets className="h-3 w-3" />
                  {forecast.precipitationProbabilityMax[i]}%
                </span>
              )}
              {forecast.precipitationProbabilityMax[i] === 0 && (
                <span className="w-12" />
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">
                  {formatTemperature(forecast.temperatureMax[i], temperatureUnit)}
                </span>
                <span className="text-muted-foreground">
                  {formatTemperature(forecast.temperatureMin[i], temperatureUnit)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
