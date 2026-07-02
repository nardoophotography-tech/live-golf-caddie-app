import { GeoPoint } from '../data/mountIsaGpsData';

// Haversine formula to calculate accurate distance between two coordinates in metres
export function haversineDistanceM(pointA: GeoPoint, pointB: GeoPoint): number {
  const R = 6371e3; // Earth radius in metres
  const rLat1 = (pointA.lat * Math.PI) / 180;
  const rLat2 = (pointB.lat * Math.PI) / 180;
  const dLat = ((pointB.lat - pointA.lat) * Math.PI) / 180;
  const dLng = ((pointB.lng - pointA.lng) * Math.PI) / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rLat1) * Math.cos(rLat2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Request current GPS position wrapped in a Promise
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    }
  });
}

// Format the GPS accuracy with +/-
export function formatGpsAccuracy(accuracyM: number): string {
  if (!accuracyM) return "Unknown";
  return `±${Math.round(accuracyM)} m / ±${Math.round(accuracyM * 1.09361)} yd`;
}

// Optional utility: If we have 2 points (Tee and Green) and want to map a real coordinate to 0-100% on a visual map line
// This is complex and might not be used if we stick to manual dragging for visual maps, but good to have a placeholder.
export function projectGeoPointToMapPercent(pt: GeoPoint, tee: GeoPoint, green: GeoPoint): number {
  const totalDist = haversineDistanceM(tee, green);
  const ptDist = haversineDistanceM(tee, pt);
  if (totalDist === 0) return 0;
  return Math.max(0, Math.min(100, (ptDist / totalDist) * 100));
}
