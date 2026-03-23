import { fetchHourlyForecast } from '@/lib/api/weather-client';
import { logError } from '@/lib/logger';
import type { Location, HourlyForecast } from '@/types/weather';

export async function getHourlyForecast(location: Location): Promise<HourlyForecast> {
  try {
    return await fetchHourlyForecast(location);
  } catch (err) {
    logError('getHourlyForecast', err, { location: location.city });
    throw err;
  }
}
