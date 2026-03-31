# Castfor Weather App

A weather forecast app built with Next.js 14, Open-Meteo API, and Leaflet maps.

**Live:** [https://castfor-weather-app](https://weather-app-rho-three-46.vercel.app/)

## Features

- **Home**: Current conditions, today's highlights (UV, wind, humidity, visibility, sunrise/sunset, pressure), 7-day forecast, mini map preview
- **Map**: Full interactive weather map with Leaflet + OpenStreetMap
- **Location**: Search locations (Open-Meteo Geocoding), saved locations list
- **Calendar**: Forecast calendar with 14-day outlook
- **Settings**: Temperature unit (C/F), wind speed unit (km/h, mph, m/s)
- **Notifications**: Sheet for weather alerts (stub; can be extended)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment (optional)**
   - Copy `.env.local.example` to `.env.local` if using Supabase for auth/saved locations.
   - No API keys required for weather or geocoding (Open-Meteo is free and keyless).

3. **Run development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The app redirects `/` to `/home`.

## Tech Stack

- **Framework**: Next.js 14 (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI (Radix primitives)
- **State**: Zustand (units, location)
- **Weather API**: Open-Meteo (no key required)
- **Geocoding**: Open-Meteo Geocoding API
- **Maps**: Leaflet + OpenStreetMap tiles

## Project Structure

```
app/
├── (weather)/          # Home, Map, Location, Calendar
├── (account)/          # Settings
├── api/geocode/        # Geocoding proxy
lib/
├── api/weather-client.ts
├── validation/weather.ts
├── weather/            # get-current, get-daily, get-hourly, time, convert
components/
├── ui/                 # Button, Card, Sheet, Tabs, Skeleton, Input
├── bottom-nav.tsx
├── notification-sheet.tsx
├── current-conditions-card.tsx
├── weather-highlights.tsx
├── daily-forecast-list.tsx
├── mini-weather-map.tsx
├── weather-map.tsx
├── search-location-input.tsx
├── saved-locations-list.tsx
├── forecast-calendar.tsx
stores/
├── use-weather-store.ts
├── use-notification-store.ts
```

## Routes

| Route       | Description                    |
|------------|--------------------------------|
| `/home`    | Current weather + 7-day forecast |
| `/map`     | Full weather map               |
| `/location`| Search & saved locations       |
| `/calendar`| Forecast calendar              |
| `/settings`| Units & preferences            |

## Location & Units

- **Default location**: Lagos (can be overridden via `?lat=&lon=` or location search)
- **Units**: Stored in Zustand; temperature (C/F) and wind (km/h, mph, m/s) toggles in Settings
