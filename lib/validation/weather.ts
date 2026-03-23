import { z } from 'zod';

export const LocationInputSchema = z.object({
  city: z.string().min(1, 'City is required'),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  country: z.string().optional(),
  timezone: z.string().optional(),
  admin1: z.string().optional(),
});

export const CurrentWeatherApiSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    relative_humidity_2m: z.number(),
    wind_speed_10m: z.number(),
    wind_direction_10m: z.number(),
    weather_code: z.number(),
    is_day: z.number(),
    uv_index: z.number().default(0),
    visibility: z.number().default(10000),
    surface_pressure: z.number().default(1013),
    precipitation: z.number().default(0),
  }),
  daily: z.object({
    time: z.array(z.string()),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
  }),
});

export const HourlyForecastApiSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    weather_code: z.array(z.number()),
    precipitation: z.array(z.number()),
    wind_speed_10m: z.array(z.number()),
    uv_index: z.array(z.number()),
    relative_humidity_2m: z.array(z.number()),
    visibility: z.array(z.number()),
    surface_pressure: z.array(z.number()),
  }),
});

export const DailyForecastApiSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  daily: z.object({
    time: z.array(z.string()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    weather_code: z.array(z.number()),
    precipitation_sum: z.array(z.number()),
    wind_speed_10m_max: z.array(z.number()),
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
    uv_index_max: z.array(z.number()),
    precipitation_probability_max: z.array(z.number().nullable()).transform(
      (arr): number[] => arr.map((v) => v ?? 0)
    ),
  }),
});

export const GeocodingApiSchema = z.object({
  results: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        country: z.string().default(''),
        country_code: z.string().default(''),
        admin1: z.string().optional(),
        timezone: z.string().default('UTC'),
      })
    )
    .default([]),
});

export type LocationInput = z.infer<typeof LocationInputSchema>;
