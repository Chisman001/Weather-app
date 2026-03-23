'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { Location } from '@/types/weather';

interface WeatherMapProps {
  location: Location;
  layer?: 'precipitation' | 'temperature' | 'wind' | 'clouds';
}

export function WeatherMap({ location, layer = 'precipitation' }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  // Synchronous sentinel set before the first await so that Strict Mode's
  // double-invoke of useEffect cannot start a second initialization while the
  // first async initMap() is still in-flight.
  const initStartedRef = useRef(false);

  useEffect(() => {
    if (!mapRef.current || initStartedRef.current) return;

    initStartedRef.current = true;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (cancelled || !mapRef.current) return;

      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [location.lat, location.lon],
        zoom: 8,
        zoomControl: true,
      });

      if (cancelled) {
        map.remove();
        return;
      }

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const layerUrls: Record<string, string> = {
        precipitation: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=',
        temperature: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=',
        wind: 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=',
        clouds: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=',
      };

      if (layerUrls[layer]) {
        L.tileLayer(layerUrls[layer], {
          opacity: 0.6,
          maxZoom: 18,
        }).addTo(map);
      }

      L.marker([location.lat, location.lon])
        .addTo(map)
        .bindPopup(`<strong>${location.city}</strong>`)
        .openPopup();
    };

    initMap();

    return () => {
      cancelled = true;
      initStartedRef.current = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapRef} className="h-full w-full rounded-xl" aria-label={`Weather map centered on ${location.city}`} />;
}
