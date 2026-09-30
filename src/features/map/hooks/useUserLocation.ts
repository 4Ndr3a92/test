import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
  heading: number ;
}

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

export const useUserLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscription = useRef<Location.LocationSubscription | null>(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionStatus('denied');
        setError('PERMISSION_DENIED');
        return;
      }

      setPermissionStatus('granted');

      // Elimina un'eventuale sottoscrizione precedente
      subscription.current?.remove();

      subscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5, // aggiorna ogni 2 metri
          timeInterval: 5000,  // oppure ogni secondo
        },
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading ?? 0,
          });
        }
      );
    } catch {
      setError('LOCATION_UNAVAILABLE');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      setPermissionStatus(status === 'granted' ? 'granted' : 'undetermined');
    });

    return () => {
      subscription.current?.remove();
    };
  }, []);

  return {
    location,
    permissionStatus,
    isLoading,
    error,
    requestLocation,
  };
};