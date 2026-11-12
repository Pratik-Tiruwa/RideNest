import axios from "axios";

export type Place = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  lat: number;
  lon: number;
};

export type ReverseGeoResult = {
  address: string;
  country?: string;
  countryCode?: string;
};

export function formatPlaceSuggestion(p: Place): string {
  return [p.name, p.city, p.state, p.country].filter(Boolean).join(", ");
}

/**
 * Search places via Photon with optional location bias and Nominatim fallback.
 */
export async function searchPlaces(
  query: string,
  options?: {
    biasLat?: number;
    biasLon?: number;
    countryCode?: string;
    signal?: AbortSignal;
  }
): Promise<Place[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const params = new URLSearchParams({
    q: trimmed,
    limit: "8",
    lang: "en",
  });
  if (options?.biasLat !== undefined && options?.biasLon !== undefined) {
    params.set("lat", String(options.biasLat));
    params.set("lon", String(options.biasLon));
  }

  let results: Place[] = [];

  try {
    const { data } = await axios.get(`https://photon.komoot.io/api/?${params.toString()}`, {
      timeout: 4500,
      signal: options?.signal,
    });

    results = (data?.features ?? [])
      .map((f: any, idx: number) => ({
        id: String(f?.properties?.osm_id ?? idx),
        name: f?.properties?.name || f?.properties?.street || f?.properties?.city || "",
        city: f?.properties?.city || f?.properties?.district || f?.properties?.county,
        state: f?.properties?.state,
        country: f?.properties?.country,
        countrycode: f?.properties?.countrycode,
        lat: f?.geometry?.coordinates?.[1],
        lon: f?.geometry?.coordinates?.[0],
      }))
      .filter((p: Place) => Boolean(p.name) && Number.isFinite(p.lat) && Number.isFinite(p.lon));
  } catch (err) {
    if (axios.isCancel(err)) throw err;
    results = [];
  }

  // Fallback to Nominatim if Photon failed or returned no matches
  if (results.length === 0) {
    try {
      const nomParams = new URLSearchParams({
        format: "json",
        q: trimmed,
        limit: "6",
        addressdetails: "1",
      });
      if (options?.countryCode) {
        nomParams.set("countrycodes", options.countryCode.toLowerCase());
      }
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?${nomParams.toString()}`, {
        timeout: 4500,
        signal: options?.signal,
      });

      results = (Array.isArray(data) ? data : []).map((item: any, idx: number) => {
        const addr = item.address ?? {};
        return {
          id: String(item.place_id ?? idx),
          name: item.name || addr.road || addr.suburb || item.display_name?.split(",")[0] || "",
          city: addr.city || addr.town || addr.village || addr.county,
          state: addr.state,
          country: addr.country,
          countrycode: addr.country_code,
          lat: Number(item.lat),
          lon: Number(item.lon),
        };
      });
    } catch (err) {
      if (axios.isCancel(err)) throw err;
    }
  }

  if (options?.countryCode && results.length > 0) {
    const target = options.countryCode.toLowerCase();
    const filtered = results.filter(
      (r) => !r.countrycode || r.countrycode.toLowerCase() === target
    );
    if (filtered.length > 0) {
      return filtered;
    }
  }

  return results;
}

/**
 * Reverse geocode coordinates with Nominatim -> BigDataCloud -> Photon fallback chain.
 */
export async function reverseGeoCode(lat: number, lon: number): Promise<ReverseGeoResult | null> {
  // 1. Nominatim
  try {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { timeout: 3500 }
    );

    if (data?.address) {
      const addr = data.address;
      const parts = [
        addr.road || addr.pedestrian || addr.suburb,
        addr.neighbourhood || addr.suburb,
        addr.city || addr.town || addr.village || addr.county,
        addr.state,
        addr.country,
      ].filter(Boolean);

      const address = Array.from(new Set(parts)).join(", ") || data.display_name;
      if (address) {
        return {
          address,
          country: addr.country,
          countryCode: addr.country_code,
        };
      }
    }
  } catch {
    // Fall through to BigDataCloud
  }

  // 2. BigDataCloud (CORS-friendly client fallback)
  try {
    const { data } = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { timeout: 3500 }
    );

    const parts = [data?.locality, data?.city, data?.principalSubdivision, data?.countryName].filter(Boolean);
    const address = Array.from(new Set(parts)).join(", ");
    if (address) {
      return {
        address,
        country: data?.countryName,
        countryCode: data?.countryCode,
      };
    }
  } catch {
    // Fall through to Photon
  }

  // 3. Photon reverse fallback
  try {
    const { data } = await axios.get(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`,
      { timeout: 3500 }
    );

    const p = data?.features?.[0]?.properties;
    if (p) {
      const locality = p.locality || p.suburb || "";
      const city = p.city || (p.county ? p.county.replace("District", "").trim() : "") || p.district || "";
      const street = p.street && p.street !== p.name ? p.street : "";
      const parts = [p.name, street, locality, city, p.state, p.postcode, p.country].filter(Boolean);
      const address = Array.from(new Set(parts)).join(", ");
      if (address) {
        return {
          address,
          country: p.country,
          countryCode: p.countrycode,
        };
      }
    }
  } catch {
    // All providers failed
  }

  return null;
}

/**
 * Haversine distance in kilometers as a fallback when routing API is unreachable.
 */
export function haversineKm(p1: [number, number], p2: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(p2[0] - p1[0]);
  const dLon = toRad(p2[1] - p1[1]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1[0])) * Math.cos(toRad(p2[0])) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

