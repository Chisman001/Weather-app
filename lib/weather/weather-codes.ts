export interface WeatherCodeInfo {
  description: string;
  icon: string;
}

const weatherCodes: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: 'sun' },
  1: { description: 'Mainly clear', icon: 'sun' },
  2: { description: 'Partly cloudy', icon: 'cloud-sun' },
  3: { description: 'Overcast', icon: 'cloud' },
  45: { description: 'Foggy', icon: 'cloud-fog' },
  48: { description: 'Icy fog', icon: 'cloud-fog' },
  51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
  53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
  55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
  56: { description: 'Freezing drizzle', icon: 'cloud-snow' },
  57: { description: 'Heavy freezing drizzle', icon: 'cloud-snow' },
  61: { description: 'Slight rain', icon: 'cloud-rain' },
  63: { description: 'Moderate rain', icon: 'cloud-rain' },
  65: { description: 'Heavy rain', icon: 'cloud-rain' },
  66: { description: 'Freezing rain', icon: 'cloud-snow' },
  67: { description: 'Heavy freezing rain', icon: 'cloud-snow' },
  71: { description: 'Slight snow', icon: 'cloud-snow' },
  73: { description: 'Moderate snow', icon: 'cloud-snow' },
  75: { description: 'Heavy snow', icon: 'cloud-snow' },
  77: { description: 'Snow grains', icon: 'cloud-snow' },
  80: { description: 'Slight showers', icon: 'cloud-rain' },
  81: { description: 'Moderate showers', icon: 'cloud-rain' },
  82: { description: 'Violent showers', icon: 'cloud-rain' },
  85: { description: 'Slight snow showers', icon: 'cloud-snow' },
  86: { description: 'Heavy snow showers', icon: 'cloud-snow' },
  95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { description: 'Thunderstorm with hail', icon: 'cloud-lightning' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return weatherCodes[code] ?? { description: 'Unknown', icon: 'cloud' };
}

export function getWeatherEmoji(code: number, isDay: boolean): string {
  if (code === 0 || code === 1) return isDay ? '☀️' : '🌙';
  if (code === 2) return isDay ? '⛅' : '🌙';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}
