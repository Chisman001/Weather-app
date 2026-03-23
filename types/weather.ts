export interface Location {
  city: string;
  lat: number;
  lon: number;
  country?: string;
  timezone?: string;
  admin1?: string;
}

export interface CurrentConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  uvIndex: number;
  visibility: number;
  pressure: number;
  precipitation: number;
  time: string;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  precipitation: number[];
  windSpeed: number[];
  uvIndex: number[];
  humidity: number[];
  visibility: number[];
  pressure: number[];
}

export interface DailyForecast {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
  precipitationSum: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationProbabilityMax: number[];
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: string;
  end: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'knots';
export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: Theme;
  defaultLocation?: Location;
  notificationsEnabled: boolean;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone: string;
}
