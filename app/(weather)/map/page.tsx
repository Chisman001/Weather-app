import dynamic from 'next/dynamic';
import { DEFAULT_LOCATION } from '@/lib/weather/default-location';
import { Skeleton } from '@/components/ui/skeleton';

const WeatherMap = dynamic(
  () => import('@/components/weather/weather-map').then((m) => m.WeatherMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  }
);

export const metadata = {
  title: 'Weather Map – Castfor',
};

export default function MapPage() {
  return (
    <div className="py-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Weather Map</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Live weather conditions around {DEFAULT_LOCATION.city}
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border" style={{ height: 'calc(100vh - 240px)', minHeight: '400px' }}>
        <WeatherMap location={DEFAULT_LOCATION} layer="precipitation" />
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Map data © OpenStreetMap contributors. Weather overlay tiles may require API key.
      </p>
    </div>
  );
}
