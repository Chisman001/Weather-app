import Link from 'next/link';
import { Wind } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';
import { LocationHeader } from '@/components/location-header';

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Link href="/home" className="flex items-center gap-2 font-bold text-primary text-lg">
            <Wind className="h-5 w-5" aria-hidden="true" />
            Castfor
          </Link>
          <LocationHeader />
        </div>
      </header>

      <main className="flex-1 pb-24 max-w-lg mx-auto w-full px-4">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
