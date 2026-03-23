import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/api/weather-client";
import { logError } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchLocations(q.trim().slice(0, 100));
    return NextResponse.json({ results });
  } catch (error) {
    logError("GeocodeAPI", error);
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 500 }
    );
  }
}
