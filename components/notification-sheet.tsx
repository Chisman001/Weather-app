'use client';

import { Bell, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNotificationStore } from '@/lib/store/notification-store';
import { getRelativeTime } from '@/lib/weather/time';
import { cn } from '@/lib/ui/utils';

const typeConfig = {
  alert: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export function NotificationSheet() {
  const { notifications, isSheetOpen, closeSheet, markAllRead } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Sheet open={isSheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>Weather alerts and updates for your location.</SheetDescription>
        </SheetHeader>

        {unreadCount > 0 && (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
              Mark all as read
            </Button>
          </div>
        )}

        <Separator className="my-4" />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="rounded-full bg-muted p-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;
              return (
                <li
                  key={n.id}
                  className={cn(
                    'flex gap-3 rounded-xl p-3 border',
                    n.read ? 'border-border bg-background' : 'border-primary/20 bg-primary/5'
                  )}
                >
                  <div className={cn('rounded-full p-2 shrink-0 self-start', config.bg)}>
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold', !n.read && 'text-foreground')}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1.5">
                      {getRelativeTime(n.time)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
