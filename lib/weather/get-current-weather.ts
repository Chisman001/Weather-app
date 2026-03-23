import { fetchCurrentConditions } from '@/lib/api/weather-client';
import { logError } from '@/lib/logger';
import type { Location, CurrentConditions } from '@/types/weather';

export async function getCurrentConditions(location: Location): Promise<CurrentConditions> {
  try {
    return await fetchCurrentConditions(location);
  } catch (err) {
    logError('getCurrentConditions', err, { location: location.city });
    throw err;
  }
}
