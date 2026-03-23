import { z } from 'zod';
import {
  CurrentWeatherApiSchema,
  HourlyForecastApiSchema,
  DailyForecastApiSchema,
  GeocodingApiSchema,
} from '@/lib/validation/weather';
import { WeatherApiError, UnexpectedWeatherDataError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import type { Location, CurrentConditions, HourlyForecast, DailyForecast, GeocodingResult } from '@/types/weather';
import { getWeatherInfo } from '@/lib/weather/weather-codes';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

const FETCH_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url: string, revalidate: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      next: { revalidate },
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function fetchAndValidate<T>(
  url: string,
  schema: z.ZodSchema<T>,
  revalidate: number,
  context: string
): Promise<T> {
  let res: Response;
  try {
    res = await fetchWithTimeout(url, revalidate);
  } catch (err) {
    logError(context, err, { url });
    throw new WeatherApiError(`Network error fetching ${context}`, 'NETWORK_ERROR', err);
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    logError(context, new Error(`HTTP ${res.status}`), { url, status: res.status, body: errorText });

    if (res.status === 429) {
      throw new WeatherApiError('Rate limit exceeded', 'RATE_LIMIT');
    }
    throw new WeatherApiError(`API error: ${res.status}`, String(res.status));
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (err) {
    logError(context, err, { url });
    throw new WeatherApiError('Invalid JSON response', 'INVALID_JSON', err);
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    logError(context, parsed.error, { url, issues: parsed.error.issues });
    throw new UnexpectedWeatherDataError(`Unexpected data shape from ${context}`, parsed.error);
  }

  return parsed.data;
}

export async function fetchCurrentConditions(location: Location): Promise<CurrentConditions> {
  const url = new URL(`${WEATHER_BASE_URL}/forecast`);
  url.searchParams.set('latitude', String(location.lat));
  url.searchParams.set('longitude', String(location.lon));
  url.searchParams.set('current', [
    'temperature_2m',
    'apparent_temperature',
    'relative_humidity_2m',
    'wind_speed_10m',
    'wind_direction_10m',
    'weather_code',
    'is_day',
    'uv_index',
    'visibility',
    'surface_pressure',
    'precipitation',
  ].join(','));
  url.searchParams.set('daily', 'sunrise,sunset');
  url.searchParams.set('forecast_days', '1');
  if (location.timezone) url.searchParams.set('timezone', location.timezone);

  const data = await fetchAndValidate(url.toString(), CurrentWeatherApiSchema, 60, 'fetchCurrentConditions');

  const info = getWeatherInfo(data.current.weather_code);
  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    weatherDescription: info.description,
    isDay: data.current.is_day === 1,
    uvIndex: data.current.uv_index ?? 0,
    visibility: data.current.visibility ?? 10000,
    pressure: data.current.surface_pressure ?? 1013,
    precipitation: data.current.precipitation ?? 0,
    time: data.current.time,
    sunrise: data.daily.sunrise[0] ?? '',
    sunset: data.daily.sunset[0] ?? '',
  };
}

export async function fetchHourlyForecast(location: Location): Promise<HourlyForecast> {
  const url = new URL(`${WEATHER_BASE_URL}/forecast`);
  url.searchParams.set('latitude', String(location.lat));
  url.searchParams.set('longitude', String(location.lon));
  url.searchParams.set('hourly', [
    'temperature_2m',
    'weather_code',
    'precipitation',
    'wind_speed_10m',
    'uv_index',
    'relative_humidity_2m',
    'visibility',
    'surface_pressure',
  ].join(','));
  url.searchParams.set('forecast_days', '2');
  if (location.timezone) url.searchParams.set('timezone', location.timezone);

  const data = await fetchAndValidate(url.toString(), HourlyForecastApiSchema, 300, 'fetchHourlyForecast');

  return {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    weatherCode: data.hourly.weather_code,
    precipitation: data.hourly.precipitation,
    windSpeed: data.hourly.wind_speed_10m,
    uvIndex: data.hourly.uv_index,
    humidity: data.hourly.relative_humidity_2m,
    visibility: data.hourly.visibility,
    pressure: data.hourly.surface_pressure,
  };
}

export async function fetchDailyForecast(location: Location): Promise<DailyForecast> {
  const url = new URL(`${WEATHER_BASE_URL}/forecast`);
  url.searchParams.set('latitude', String(location.lat));
  url.searchParams.set('longitude', String(location.lon));
  url.searchParams.set('daily', [
    'temperature_2m_max',
    'temperature_2m_min',
    'weather_code',
    'precipitation_sum',
    'wind_speed_10m_max',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_probability_max',
  ].join(','));
  url.searchParams.set('forecast_days', '16');
  if (location.timezone) url.searchParams.set('timezone', location.timezone);

  const data = await fetchAndValidate(url.toString(), DailyForecastApiSchema, 1800, 'fetchDailyForecast');

  return {
    time: data.daily.time,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    weatherCode: data.daily.weather_code,
    precipitationSum: data.daily.precipitation_sum,
    windSpeedMax: data.daily.wind_speed_10m_max,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    uvIndexMax: data.daily.uv_index_max,
    precipitationProbabilityMax: (data.daily.precipitation_probability_max as number[]),
  };
}

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const url = new URL(`${GEOCODING_BASE_URL}/search`);
  url.searchParams.set('name', query.trim());
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const data = await fetchAndValidate(url.toString(), GeocodingApiSchema, 3600, 'searchLocations');

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country ?? '',
    country_code: r.country_code ?? '',
    admin1: r.admin1,
    timezone: r.timezone ?? 'UTC',
  }));
}
