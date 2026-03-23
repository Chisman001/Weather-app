import Link from 'next/link';
import { Map } from 'lucide-react';
import type { Location } from '@/types/weather';

interface MiniWeatherMapProps {
  location: Location;
}

export function MiniWeatherMap({ location }: MiniWeatherMapProps) {
  const tileUrl = `https://tile.openstreetmap.org/10/${Math.floor((location.lon + 180) / 360 * 1024)}/${Math.floor((1 - Math.log(Math.tan(location.lat * Math.PI / 180) + 1 / Math.cos(location.lat * Math.PI / 180)) / Math.PI) / 2 * 1024)}.png`;

  return (
    <section aria-label="Map preview">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Map
      </h2>
      <Link
        href="/map"
        className="block relative overflow-hidden rounded-2xl border border-border hover:border-primary/40 transition-colors group"
        aria-label="Open full weather map"
      >
        <div
          className="h-40 bg-gradient-to-br from-green-100 via-blue-100 to-sky-200 dark:from-green-900/20 dark:via-blue-900/20 dark:to-sky-900/20 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Map className="h-10 w-10" />
            <span className="text-sm font-medium">
              {location.city} · {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors rounded-2xl">
          <span className="rounded-full bg-primary/90 px-4 py-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Open full map →
          </span>
        </div>
      </Link>
    </section>
  );
}
