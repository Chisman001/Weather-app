import type { TemperatureUnit, WindSpeedUnit } from '@/types/weather';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = convertTemperature(celsius, unit);
  return `${value}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  switch (unit) {
    case 'mph':
      return Math.round(kmh * 0.621371);
    case 'ms':
      return Math.round(kmh / 3.6);
    case 'knots':
      return Math.round(kmh * 0.539957);
    default:
      return Math.round(kmh);
  }
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const value = convertWindSpeed(kmh, unit);
  return `${value} ${unit}`;
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUvIndexLabel(uvIndex: number): { label: string; color: string } {
  if (uvIndex <= 2) return { label: 'Low', color: 'text-green-500' };
  if (uvIndex <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
  if (uvIndex <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
}

export function getVisibilityLabel(meters: number): string {
  const km = meters / 1000;
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  if (km >= 1) return 'Poor';
  return 'Very Poor';
}
