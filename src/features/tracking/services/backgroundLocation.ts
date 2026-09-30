import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { useTrackingStore } from '../store/trackingStore';
import { checkOffRoute } from './offRouteService';
import { checkNearbyPois } from './poiService';
import { TrackingStatsCalculator } from './trackingStats';

export const LOCATION_TASK = 'trail-background-location';

const calculator = new TrackingStatsCalculator();

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('[BackgroundLocation]', error);
    return;
  }

  if (!data) return;

  const { locations } = data as {
    locations: Location.LocationObject[];
  };

  if (!locations || locations.length === 0) return;

  const position = locations[locations.length - 1];
  const store = useTrackingStore.getState();

  const point = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    altitude: position.coords.altitude ?? 0,
  };

  // Aggiorna il percorso dell'utente
  store.addPoint(point);

  // Recupera i secondi attuali dallo store e calcola le statistiche sincronizzate
  const currentElapsedSeconds = store.stats.elapsedSeconds;
  const stats = calculator.update(point, currentElapsedSeconds);
  store.setStats(stats);

  const route = store.route;

  // Controlla POI vicini e Fuori Percorso
  try {
    await checkNearbyPois(point.lat, point.lng);

    if (route && route.length > 1) {
      await checkOffRoute(point.lat, point.lng, route);
    }
  } catch (e) {
    console.error('[POI/OffRoute]', e);
  }
});

export async function startBackgroundTracking() {
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) {
    return;
  }

  if (!(await Location.hasServicesEnabledAsync())) {
    throw new Error('LOCATION_SERVICES_DISABLED');
  }

  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') {
    throw new Error('FOREGROUND_PERMISSION_DENIED');
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== 'granted') {
    throw new Error('BACKGROUND_PERMISSION_DENIED');
  }

  const notification = await Notifications.requestPermissionsAsync();
  if (notification.status !== 'granted') {
    throw new Error('NOTIFICATION_PERMISSION_DENIED');
  }

  calculator.start();

  const options: Location.LocationTaskOptions = {
    accuracy: Location.Accuracy.BestForNavigation,
    distanceInterval: 5,
    timeInterval: 1000,
    activityType: Location.ActivityType.Fitness,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  };

  if (Platform.OS === 'android') {
    options.foregroundService = {
      notificationTitle: 'Tracking attivo',
      notificationBody: 'Stiamo monitorando il percorso.',
    };
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK, options);
}

export async function stopBackgroundTracking() {
  if (!(await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK))) {
    return;
  }

  calculator.reset();
  await Location.stopLocationUpdatesAsync(LOCATION_TASK);
}

export async function isBackgroundTrackingActive() {
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
}