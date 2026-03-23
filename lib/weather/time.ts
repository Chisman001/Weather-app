/**
 * Timezone-aware date formatting utilities for weather data.
 * All formatting respects the location's timezone when provided.
 */

export function formatTime(isoString: string, timezone?: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}

export function formatDate(isoString: string, timezone?: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });
}

export function formatShortDate(isoString: string, timezone?: string): string {
  const date = new Date(isoString.includes('T') ? isoString : `${isoString}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  });
}

export function formatWeekday(isoDateString: string, timezone?: string): string {
  const date = new Date(`${isoDateString}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: timezone,
  });
}

export function formatHour(isoString: string, timezone?: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  });
}

export function isToday(isoDateString: string, timezone?: string): boolean {
  const date = new Date(`${isoDateString}T00:00:00`);
  const today = new Date();

  const dateStr = date.toLocaleDateString('en-US', { timeZone: timezone });
  const todayStr = today.toLocaleDateString('en-US', { timeZone: timezone });

  return dateStr === todayStr;
}

export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function getCurrentHourIndex(times: string[]): number {
  const now = new Date();
  return times.findIndex((t) => {
    const date = new Date(t);
    return date >= now;
  });
}
