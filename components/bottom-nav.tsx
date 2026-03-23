'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, MapPin, Calendar, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/ui/utils';
import { useNotificationStore } from '@/lib/store/notification-store';
import { NotificationSheet } from '@/components/notification-sheet';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/location', icon: MapPin, label: 'Location' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/settings', icon: Settings, label: 'Settings' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { openSheet, notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-md safe-area-pb"
      >
        <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium transition-all duration-200',
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 h-0 overflow-hidden'
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={openSheet}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <span className="text-xs font-medium opacity-0 h-0 overflow-hidden">Alerts</span>
          </button>
        </div>
      </nav>

      <NotificationSheet />
    </>
  );
}
