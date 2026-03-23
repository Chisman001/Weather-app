'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location, TemperatureUnit, WindSpeedUnit, Theme } from '@/types/weather';

interface PreferencesState {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: Theme;
  selectedLocation: Location | null;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTheme: (theme: Theme) => void;
  setSelectedLocation: (location: Location) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      theme: 'system',
      selectedLocation: null,
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setTheme: (theme) => set({ theme }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),
    }),
    {
      name: 'castfor-preferences',
    }
  )
);
