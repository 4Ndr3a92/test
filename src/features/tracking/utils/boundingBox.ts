import { Coordinate } from "@/shared/type/trail";


export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Crea una bounding box centrata su una coordinata.
 *
 * @param center Centro della bounding box
 * @param delta Mezzo lato in gradi.
 *              0.0009 ≈ 100 m
 */
export function createBoundingBox(
  center: Coordinate,
  delta = 0.0009
): BoundingBox {
  return {
    minLat: center.lat - delta,
    maxLat: center.lat + delta,
    minLng: center.lng - delta,
    maxLng: center.lng + delta,
  };
}

/**
 * Verifica se un punto è contenuto nella bounding box.
 */
export function contains(
  box: BoundingBox,
  point: Coordinate
): boolean {
  return (
    point.lat >= box.minLat &&
    point.lat <= box.maxLat &&
    point.lng >= box.minLng &&
    point.lng<= box.maxLng
  );
}

/**
 * Espande una bounding box di un certo delta.
 */
export function expand(
  box: BoundingBox,
  delta: number
): BoundingBox {
  return {
    minLat: box.minLat - delta,
    maxLat: box.maxLat + delta,
    minLng: box.minLng - delta,
    maxLng: box.maxLng + delta,
  };
}