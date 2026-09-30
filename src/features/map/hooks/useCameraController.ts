import { RefObject, useCallback, useEffect, useRef } from 'react';
import type { Camera } from '@rnmapbox/maps';
import { TrailRoute } from '@/features/map/api/mapApi';

export type CameraMode = 'free' | 'follow' | 'navigation';

interface Props {
  mapRef: RefObject<any>;
  cameraRef: RefObject<Camera | null>;
  location: {
    latitude: number;
    longitude: number;
    heading: number;
  } | null;
  trailRoute: TrailRoute | null | undefined;
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
}

export const useCameraController = ({
  mapRef,
  cameraRef,
  location,
  trailRoute,
  cameraMode,
  setCameraMode,
}: Props) => {
  const lastAnimatedCoords = useRef<string>('');

  // 1. SPOSTAMENTO SULL'UTENTE (Sempre in 2D / Mode 'follow')
  const moveToUser = useCallback(async () => {
    if (!location || !mapRef.current || !cameraRef.current) return;

    try {
      const currentZoom = await mapRef.current.getZoom();

      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: Math.max(currentZoom, 15),
        pitch: 0,
        heading: location.heading ?? 0,
        animationDuration: 500,
        animationMode: 'easeTo',
      });

      setCameraMode('follow');
    } catch (error) {
      console.warn('Errore durante moveToUser:', error);
    }
  }, [location?.latitude, location?.longitude, location?.heading, mapRef, cameraRef, setCameraMode]);

  // 2. NAVIGAZIONE ATTIVA (Inclinazione 3D 60°)
  const startNavigation = useCallback(() => {
    if (!location || !cameraRef.current) return;

    cameraRef.current.setCamera({
      centerCoordinate: [location.longitude, location.latitude],
      zoomLevel: 18,
      pitch: 60,
      heading: location.heading ?? 0,
      animationDuration: 700,
      animationMode: 'easeTo',
    });

    setCameraMode('navigation');
  }, [location?.latitude, location?.longitude, location?.heading, cameraRef, setCameraMode]);

  // 3. RESET DELLA TELECAMERA (Passa a 'free')
  const resetCamera = useCallback(() => {
    if (!cameraRef.current) return;

    cameraRef.current.setCamera({
      pitch: 0,
      heading: 0,
      animationDuration: 500,
      animationMode: 'easeTo',
    });

    setCameraMode('free');
  }, [cameraRef, setCameraMode]);

  // 4. INQUADRATURA COMPLETA DEL SENTIERO (FIT BOUNDS)
  const fitTrail = useCallback(() => {
    if (!trailRoute || !cameraRef.current || trailRoute.coordinates.length < 2) return;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

    for (const [lng, lat] of trailRoute.coordinates) {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    }

    setCameraMode('free');

    cameraRef.current.fitBounds(
      [maxLng, maxLat], // ne
      [minLng, minLat], // sw
      [60, 80, 340, 60], // padding
      600
    );
  }, [trailRoute, cameraRef, setCameraMode]);

  // 5. ZOOM AVANTI INCREMENTALE (+1)
  const zoomIn = useCallback(async () => {
    if (!mapRef.current || !cameraRef.current) return;

    setCameraMode('free');

    try {
      const currentCenter = await mapRef.current.getCenter();
      const currentZoom = await mapRef.current.getZoom();

      cameraRef.current.setCamera({
        centerCoordinate: currentCenter,
        zoomLevel: currentZoom + 1,
        animationDuration: 250,
      });
    } catch (error) {
      console.warn('Errore durante zoomIn:', error);
    }
  }, [mapRef, cameraRef, setCameraMode]);

  // 6. ZOOM INDIETRO DECREMENTALE (-1)
  const zoomOut = useCallback(async () => {
    if (!mapRef.current || !cameraRef.current) return;

    setCameraMode('free');

    try {
      const currentCenter = await mapRef.current.getCenter();
      const currentZoom = await mapRef.current.getZoom();

      cameraRef.current.setCamera({
        centerCoordinate: currentCenter,
        zoomLevel: currentZoom - 1,
        animationDuration: 250,
      });
    } catch (error) {
      console.warn('Errore durante zoomOut:', error);
    }
  }, [mapRef, cameraRef, setCameraMode]);

  // 7. INSEGUIMENTO LIVE POSIZIONE GPS
  useEffect(() => {
    if (!location || !cameraRef.current || cameraMode === 'free') return;

    const latFixed = location.latitude.toFixed(5);
    const lngFixed = location.longitude.toFixed(5);
    const headingFixed = Math.round(location.heading ?? 0);
    const coordKey = `${latFixed}-${lngFixed}-${headingFixed}-${cameraMode}`;

    if (lastAnimatedCoords.current === coordKey) return;
    lastAnimatedCoords.current = coordKey;

    if (cameraMode === 'follow') {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        heading: location.heading ?? 0,
        animationDuration: 400,
        animationMode: 'easeTo',
      });
    } else if (cameraMode === 'navigation') {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        heading: location.heading ?? 0,
        pitch: 60,
        zoomLevel: 18,
        animationDuration: 500,
        animationMode: 'easeTo',
      });
    }
  }, [location?.latitude, location?.longitude, location?.heading, cameraMode, cameraRef]);

  // 8. TOGGLE PERSPECTIVE (2D / 3D)
  const togglePerspective = useCallback(async (currentIs3D: boolean, setIs3D: (val: boolean) => void) => {
    if (!mapRef.current || !cameraRef.current) return;

    try {
      const currentCenter = await mapRef.current.getCenter();
      const targetPitch = currentIs3D ? 0 : 60;

      cameraRef.current.setCamera({
        centerCoordinate: currentCenter,
        pitch: targetPitch,
        animationDuration: 300,
      });

      setIs3D(!currentIs3D);
    } catch (error) {
      console.warn('Errore durante togglePerspective:', error);
    }
  }, [mapRef, cameraRef]);

  return {
    moveToUser,
    startNavigation,
    resetCamera,
    fitTrail,
    zoomIn,
    zoomOut,
    togglePerspective,
  };
};