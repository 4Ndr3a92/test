import { Coordinate } from '@/shared/type/trail';
import {

  bearing,

  distanceToSegment,
  haversine,
} from '../utils/distance';
import { closestPoint } from '../utils/closestPoint';

const OFF_ROUTE_DISTANCE = 30; // metri
const FINISH_DISTANCE = 20; // metri

export function closestSegment(route: Coordinate[], position: Coordinate) {
  if (route.length < 2) return null;

  let nearest = 0;
  let minDistance = Number.MAX_VALUE;

  for (let i = 0; i < route.length - 1; i++) {
    const distance = distanceToSegment(position, route[i], route[i + 1]);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = i;
    }
  }

  return {
    index: nearest,
    start: route[nearest],
    end: route[nearest + 1],
    distance: minDistance,
  };
}

export function distanceToRoute(route: Coordinate[], position: Coordinate): number {
  const segment = closestSegment(route, position);
  return segment?.distance ?? Number.MAX_VALUE;
}

export function isOffRoute(
  route: Coordinate[],
  position: Coordinate,
  threshold = OFF_ROUTE_DISTANCE
): boolean {
  return distanceToRoute(route, position) > threshold;
}

export function nearestPointOnRoute(
  route: Coordinate[],
  position: Coordinate
): Coordinate | null {
  const segment = closestSegment(route, position);
  if (!segment) return null;

  return closestPoint(position, segment.start, segment.end);
}

export function routeBearing(route: Coordinate[], position: Coordinate): number {
  const segment = closestSegment(route, position);
  if (!segment) return 0;

  return bearing(segment.start, segment.end);
}

export function hasReachedFinish(
  route: Coordinate[],
  position: Coordinate,
  threshold = FINISH_DISTANCE
): boolean {
  if (!route.length) return false;

  const finish = route[route.length - 1];
  return haversine(position, finish) <= threshold;
}

export function nextWaypoint(route: Coordinate[], position: Coordinate): Coordinate | null {
  const segment = closestSegment(route, position);
  if (!segment) return null;

  return segment.end;
}