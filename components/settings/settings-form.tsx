'use client';

import { Thermometer, Wind, Sun, Bell } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { usePreferencesStore } from '@/lib/store/preferences-store';
import { useNotificationStore } from '@/lib/store/notification-store';
import type { TemperatureUnit, WindSpeedUnit, Theme } from '@/types/weather';

function SettingsRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="rounded-lg bg-muted p-2 shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsForm() {
  const { temperatureUnit, windSpeedUnit, theme, setTemperatureUnit, setWindSpeedUnit, setTheme } =
    usePreferencesStore();
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-1">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Units</p>
        </div>

        <div className="px-4 divide-y divide-border">
          <SettingsRow
            icon={<Thermometer className="h-4 w-4 text-orange-500" />}
            label="Temperature"
            description="Display temperature in Celsius or Fahrenheit"
          >
            <Select
              value={temperatureUnit}
              onValueChange={(v) => setTemperatureUnit(v as TemperatureUnit)}
            >
              <SelectTrigger className="w-28 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>

          <SettingsRow
            icon={<Wind className="h-4 w-4 text-blue-500" />}
            label="Wind Speed"
            description="Choose your preferred wind speed unit"
          >
            <Select
              value={windSpeedUnit}
              onValueChange={(v) => setWindSpeedUnit(v as WindSpeedUnit)}
            >
              <SelectTrigger className="w-28 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kmh">km/h</SelectItem>
                <SelectItem value="mph">mph</SelectItem>
                <SelectItem value="ms">m/s</SelectItem>
                <SelectItem value="knots">knots</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden mt-4">
        <div className="px-4 py-3 bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Appearance</p>
        </div>

        <div className="px-4 divide-y divide-border">
          <SettingsRow
            icon={<Sun className="h-4 w-4 text-yellow-500" />}
            label="Theme"
            description="Light, dark, or follow system preference"
          >
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden mt-4">
        <div className="px-4 py-3 bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notifications</p>
        </div>

        <div className="px-4 divide-y divide-border">
          <SettingsRow
            icon={<Bell className="h-4 w-4 text-primary" />}
            label="Weather Alerts"
            description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          >
            <Switch defaultChecked />
          </SettingsRow>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground font-medium">Castfor Weather</p>
        <p className="text-xs text-muted-foreground/60">
          Powered by{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Open-Meteo
          </a>{' '}
          · Free, no API key required
        </p>
      </div>
    </div>
  );
}
