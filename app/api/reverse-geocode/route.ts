import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { NominatimReverseSchema, OpenMeteoTimezoneSchema } from '@/lib/validation/weather';
import { logError } from '@/lib/logger';

const QuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

export async function GET(request: NextRequest) {
  const rawLat = request.nextUrl.searchParams.get('lat');
  const rawLon = request.nextUrl.searchParams.get('lon');

  const parsed = QuerySchema.safeParse({ lat: rawLat, lon: rawLon });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const { lat, lon } = parsed.data;

  try {
    const [nominatimRes, openMeteoRes] = await Promise.all([
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: { 'User-Agent': 'Castfor Weather App (contact@castfor.app)' },
          next: { revalidate: 86400 },
        }
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&forecast_days=1&timezone=auto`,
        { next: { revalidate: 86400 } }
      ),
    ]);

    if (!nominatimRes.ok) {
      logError('ReverseGeocodeAPI', new Error(`Nominatim HTTP ${nominatimRes.status}`), { lat, lon });
      return NextResponse.json({ error: 'Reverse geocoding failed' }, { status: 502 });
    }
    if (!openMeteoRes.ok) {
      logError('ReverseGeocodeAPI', new Error(`Open-Meteo HTTP ${openMeteoRes.status}`), { lat, lon });
      return NextResponse.json({ error: 'Timezone lookup failed' }, { status: 502 });
    }

    const [nominatimJson, openMeteoJson] = await Promise.all([
      nominatimRes.json(),
      openMeteoRes.json(),
    ]);

    const nominatimParsed = NominatimReverseSchema.safeParse(nominatimJson);
    const openMeteoParsed = OpenMeteoTimezoneSchema.safeParse(openMeteoJson);

    if (!nominatimParsed.success) {
      logError('ReverseGeocodeAPI', nominatimParsed.error, { lat, lon });
      return NextResponse.json({ error: 'Unexpected geocoding response' }, { status: 502 });
    }
    if (!openMeteoParsed.success) {
      logError('ReverseGeocodeAPI', openMeteoParsed.error, { lat, lon });
      return NextResponse.json({ error: 'Unexpected timezone response' }, { status: 502 });
    }

    const { address } = nominatimParsed.data;
    const city = address.city ?? address.town ?? address.village ?? 'Current Location';
    const country = address.country_code.toUpperCase();
    const timezone = openMeteoParsed.data.timezone;

    return NextResponse.json({ city, country, timezone });
  } catch (error) {
    logError('ReverseGeocodeAPI', error, { lat, lon });
    return NextResponse.json({ error: 'Reverse geocoding failed' }, { status: 500 });
  }
}
