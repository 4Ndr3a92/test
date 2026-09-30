import { Coordinate } from '@/shared/type/trail';
import { haversine } from './distance';

/**
 * Calcola il punto più vicino sul segmento AB rispetto al punto P.
 */
export function closestPoint(
  p: Coordinate,
  a: Coordinate,
  b: Coordinate
): Coordinate {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;

  // Se i punti del segmento coincidono, restituisci A
  if (dx === 0 && dy === 0) {
    return { lat: a.lat, lng: a.lng };
  }

  // Calcolo della proiezione scalare u (limitata tra 0 e 1)
  const u = Math.max(
    0,
    Math.min(
      1,
      ((p.lng - a.lng) * dx + (p.lat - a.lat) * dy) / (dx * dx + dy * dy)
    )
  );

  return {
    lat: a.lat + u * dy,
    lng: a.lng + u * dx,
  };
}

/**
 * Calcola la distanza in metri dal punto P al segmento AB.
 */
export function distanceToSegment(
  p: Coordinate,
  a: Coordinate,
  b: Coordinate
): number {
  const closest = closestPoint(p, a, b);
  return haversine(p, closest); // Assicurati di usare la tua funzione haversine
}