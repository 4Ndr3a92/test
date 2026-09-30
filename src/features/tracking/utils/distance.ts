import {
  getDistance,
  getGreatCircleBearing,
  getDistanceFromLine,
} from 'geolib';
import { Coordinate } from '@/shared/type/trail';

const toGeolib = (coord: Coordinate) => ({
  latitude: coord.lat,
  longitude: coord.lng,
});

/**
 * Distanza Haversine in metri.
 */
export function haversine(
  a: Coordinate,
  b: Coordinate
): number {
  return getDistance(
    toGeolib(a),
    toGeolib(b)
  );
}

/**
 * Bearing geografico (0-360°).
 */
export function bearing(
  from: Coordinate,
  to: Coordinate
): number {
  return getGreatCircleBearing(
    toGeolib(from),
    toGeolib(to)
  );
}

/**
 * Distanza punto-segmento in metri.
 */
export function distanceToSegment(
  point: Coordinate,
  start: Coordinate,
  end: Coordinate
): number {
  return getDistanceFromLine(
    toGeolib(point),
    toGeolib(start),
    toGeolib(end)
  );
}


export function toCoordinates(
  coordinates: [number, number][]
): Coordinate[] {
  return coordinates.map(([lng, lat]) => ({
    lat,
    lng,
  }));
}