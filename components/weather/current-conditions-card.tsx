import { Droplets, Wind, Eye, Thermometer } from 'lucide-react';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { formatTemperature, formatWindSpeed, getWindDirectionLabel } from '@/lib/weather/units';
import { formatTime, getRelativeTime } from '@/lib/weather/time';
import type { CurrentConditions, Location, TemperatureUnit, WindSpeedUnit } from '@/types/weather';

interface CurrentConditionsCardProps {
  conditions: CurrentConditions;
  location: Location;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
}

export function CurrentConditionsCard({
  conditions,
  location,
  temperatureUnit,
  windSpeedUnit,
}: CurrentConditionsCardProps) {
  const {
    temperature,
    feelsLike,
    weatherCode,
    weatherDescription,
    isDay,
    humidity,
    windSpeed,
    windDirection,
    sunrise,
    sunset,
    time,
  } = conditions;

  const isDaytime = isDay;
  const gradientClass = isDaytime
    ? 'from-sky-400 via-blue-500 to-indigo-600'
    : 'from-slate-700 via-slate-800 to-slate-900';

  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClass} p-6 text-white shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-white/80 text-sm font-medium">{location.city}</span>
            {location.country && (
              <span className="text-white/60 text-xs">{location.country}</span>
            )}
          </div>
          <p className="text-white/70 text-xs">Updated {getRelativeTime(time)}</p>
        </div>
        <WeatherIcon
          code={weatherCode}
          isDay={isDaytime}
          size={56}
          className="text-white drop-shadow-lg"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-end gap-3">
          <span className="text-7xl font-thin leading-none tracking-tighter">
            {formatTemperature(temperature, temperatureUnit).replace(/°[FC]/, '')}
            <span className="text-4xl align-top mt-3 inline-block">
              {temperatureUnit === 'fahrenheit' ? '°F' : '°C'}
            </span>
          </span>
        </div>
        <p className="mt-1 text-lg text-white/90 font-medium">{weatherDescription}</p>
        <p className="text-sm text-white/70 flex items-center gap-1 mt-0.5">
          <Thermometer className="h-3.5 w-3.5" />
          Feels like {formatTemperature(feelsLike, temperatureUnit)}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 backdrop-blur-sm p-3">
          <Droplets className="h-4 w-4 text-white/80" />
          <span className="text-xs text-white/70">Humidity</span>
          <span className="text-sm font-semibold">{humidity}%</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 backdrop-blur-sm p-3">
          <Wind className="h-4 w-4 text-white/80" />
          <span className="text-xs text-white/70">Wind</span>
          <span className="text-sm font-semibold">
            {formatWindSpeed(windSpeed, windSpeedUnit)}
          </span>
          <span className="text-xs text-white/60">{getWindDirectionLabel(windDirection)}</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 backdrop-blur-sm p-3">
          <Eye className="h-4 w-4 text-white/80" />
          <span className="text-xs text-white/70">Sunrise</span>
          <span className="text-sm font-semibold">{formatTime(sunrise, location.timezone)}</span>
          <span className="text-xs text-white/60">{formatTime(sunset, location.timezone)} ↓</span>
        </div>
      </div>
    </article>
  );
}
