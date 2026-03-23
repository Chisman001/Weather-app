import { WeatherIcon } from '@/components/weather/weather-icon';
import { formatTemperature } from '@/lib/weather/units';
import { cn } from '@/lib/ui/utils';
import type { DailyForecast, Location, TemperatureUnit } from '@/types/weather';

interface ForecastCalendarProps {
  forecast: DailyForecast;
  location: Location;
  temperatureUnit: TemperatureUnit;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function ForecastCalendar({ forecast, location, temperatureUnit }: ForecastCalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build forecast lookup by date string
  const forecastByDate: Record<string, { maxTemp: number; minTemp: number; code: number; precipProb: number }> = {};
  forecast.time.forEach((dateStr, i) => {
    forecastByDate[dateStr] = {
      maxTemp: forecast.temperatureMax[i],
      minTemp: forecast.temperatureMin[i],
      code: forecast.weatherCode[i],
      precipProb: forecast.precipitationProbabilityMax[i],
    };
  });

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section aria-label="Monthly forecast calendar">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">
          {MONTHS[month]} {year}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = forecastByDate[dateStr];
          const isToday = day === today.getDate();

          return (
            <div
              key={dateStr}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-center transition-colors',
                isToday
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 hover:bg-muted/60 border border-border/30'
              )}
            >
              <span className={cn('text-xs font-medium', isToday ? 'text-primary-foreground' : 'text-foreground')}>
                {day}
              </span>
              {data ? (
                <>
                  <WeatherIcon
                    code={data.code}
                    isDay={true}
                    size={14}
                    className={isToday ? 'text-primary-foreground' : undefined}
                  />
                  <span className={cn('text-[10px] font-semibold leading-none', isToday ? 'text-primary-foreground' : 'text-foreground')}>
                    {formatTemperature(data.maxTemp, temperatureUnit).replace(/°[FC]/, '°')}
                  </span>
                  <span className={cn('text-[9px] leading-none', isToday ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {formatTemperature(data.minTemp, temperatureUnit).replace(/°[FC]/, '°')}
                  </span>
                </>
              ) : (
                <span className="text-[10px] text-muted-foreground">—</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
