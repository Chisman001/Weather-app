import { Suspense } from 'react';
import { getDailyForecast } from '@/lib/weather/get-daily-forecast';
import { DEFAULT_LOCATION } from '@/lib/weather/default-location';
import { ForecastCalendar } from '@/components/weather/forecast-calendar';
import { DailyForecastList } from '@/components/weather/daily-forecast-list';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 1800;

export const metadata = {
  title: 'Calendar – Castfor',
};

async function CalendarContent() {
  const forecast = await getDailyForecast(DEFAULT_LOCATION);

  return (
    <div className="space-y-6">
      <ForecastCalendar
        forecast={forecast}
        location={DEFAULT_LOCATION}
        temperatureUnit="celsius"
      />
      <DailyForecastList
        forecast={forecast}
        location={DEFAULT_LOCATION}
        temperatureUnit="celsius"
        limit={16}
      />
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-72 rounded-2xl" />
      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <div className="py-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Forecast Calendar</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          16-day outlook for {DEFAULT_LOCATION.city}
        </p>
      </div>
      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
}
