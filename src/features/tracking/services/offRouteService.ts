import { Coordinate } from '@/shared/type/trail';
import { useTrackingStore } from '../store/trackingStore';
import { sendOffRoute } from './notificationService';
import { distanceToRoute } from './routeService';

const OFF_ROUTE_DISTANCE = 30;
const BACK_ON_ROUTE_DISTANCE = 20;

export async function checkOffRoute(
  latitude: number,
  longitude: number,
  route: Coordinate[]
) {
  if (route.length < 2) return;

  const store = useTrackingStore.getState();
  const point: Coordinate = { lat: latitude, lng: longitude };

  const minDistance = distanceToRoute(route, point);

  // Fuori percorso
  if (!store.offRoute && minDistance > OFF_ROUTE_DISTANCE) {
    store.setOffRoute(true);
    await sendOffRoute(minDistance);
    return;
  }

  // Rientrato sul percorso (isteresi)
  if (store.offRoute && minDistance < BACK_ON_ROUTE_DISTANCE) {
    store.setOffRoute(false);
  }
}