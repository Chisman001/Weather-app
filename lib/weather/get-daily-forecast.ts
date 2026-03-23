import { fetchDailyForecast } from '@/lib/api/weather-client';
import { logError } from '@/lib/logger';
import type { Location, DailyForecast } from '@/types/weather';

export async function getDailyForecast(location: Location): Promise<DailyForecast> {
  try {
    return await fetchDailyForecast(location);
  } catch (err) {
    logError('getDailyForecast', err, { location: location.city });
    throw err;
  }
}
