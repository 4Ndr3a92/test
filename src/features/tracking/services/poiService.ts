import { getDistance } from 'geolib';
import { usePoiStore } from '@/features/poi/store/poiStore';
import { useTrackingStore } from '../store/trackingStore';
import { TrailPOI } from '../types';
import { contains, createBoundingBox } from '../utils/boundingBox';
import { sendPoi } from './notificationService';

const NOTIFICATION_DISTANCE = 25; // metri

export async function initializePois() {
  await usePoiStore.getState().load();
}

export async function reloadPois() {
  await usePoiStore.getState().reload();
}

export function getAllPois() {
  return usePoiStore.getState().pois;
}

export function resetNotifications() {
  useTrackingStore.setState({
    notifiedPois: [],
  });
}

export async function notifyPoi(poi: TrailPOI) {
  const store = useTrackingStore.getState();

  if (store.isPoiNotified(poi.id)) {
    return;
  }

  store.addNotifiedPoi(poi.id);
  await sendPoi(poi);
}

export async function checkNearbyPois(lat: number, lng: number) {
  const store = useTrackingStore.getState();
  const pois = usePoiStore.getState().pois;

  if (pois.length === 0) return;

  // Bounding Box (~100 m)
  const box = createBoundingBox({ lat, lng }, 0.0009);

  for (const poi of pois) {
    if (store.isPoiNotified(poi.id)) {
      continue;
    }

    if (!contains(box, { lat: poi.latitude, lng: poi.longitude })) {
      continue;
    }

    const distance = getDistance(
      { latitude: lat, longitude: lng },
      { latitude: poi.latitude, longitude: poi.longitude }
    );

    if (distance > NOTIFICATION_DISTANCE) {
      continue;
    }

    try {
      await notifyPoi(poi);
    } catch (err) {
      console.error('[POI]', err);
    }
  }
}