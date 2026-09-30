import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
} from '@rnmapbox/maps';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { colors } from '@/shared/theme';
import { CustomMarker } from '../components/CustomMarker';
import { UserLocationMarker } from '../components/UserLocationMarker';
import { useMapTrails } from '../hooks/useMapTrails';
import { useTrailRoute } from '../hooks/useTrailRoute';
import { useUserLocation } from '../hooks/useUserLocation';
import { MAP_STYLES, useMapStore } from '../store/mapStore';
import { useCameraController } from '../hooks/useCameraController';
import { useTrackingStore } from '@/features/tracking/store/trackingStore';
import { toCoordinates } from '@/features/tracking/utils/distance';
import { usePoiStore } from '../../poi/store/poiStore';
import { MapCameraControls } from '../components/MapCameraControls';
import { TrackingModal } from '@/features/tracking/screens/TrackingModal';
import { getPoiMarkerConfig } from '@/features/poi/utils/poiUtils';

Mapbox.setAccessToken('sk.eyJ1IjoiZmFrZSIsImEiOiJjbGZha2V0b2tlbiJ9.fake');

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;
const INITIAL_CENTER: [number, number] = [15.1, 37.85];
const INITIAL_ZOOM = 10;
const INITIAL_PITCH = 0;

const POI_ZOOM_THRESHOLD = 14;
const TRAIL_ZOOM_THRESHOLD = 10;

const ROUTE_COLOR = 'rgba(100, 200, 100, 0.7)';
const TRACKING_COLOR = 'rgba(33, 150, 243, 0.7)';

export type CameraMode = 'free' | 'follow' | 'navigation';

const toLineGeoJson = (coords: [number, number][]) => {
  if (coords.length < 2) return null;
  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: { type: 'LineString' as const, coordinates: coords },
        properties: {},
      },
    ],
  };
};

export const MapScreen: React.FC = () => {
  const router = useRouter();
  const { autoFitTrailId, poiId } = useLocalSearchParams<{ autoFitTrailId?: string; poiId?: string }>();
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<MapView>(null);
  
  // Ref per tracciare lo stato di montaggio ed evitare crash durante il "Back"
  const isMountedRef = useRef(true);
  const hasAutoLocated = useRef(false);

  const [cameraMode, setCameraMode] = useState<CameraMode>('free');
  const [showPois, setShowPois] = useState(false);
  const [showTrails, setShowTrails] = useState(true);

  // Map Store
  const { selectedStyle, setSelectedStyle, openTrail, selectedTrailId, openPoi, selectedPoiId, currentTrail, state } = useMapStore();
  
  // Tracking Store - Selettori atomici per evitare re-render ogni secondo scatenati dal timer
  const active = useTrackingStore((s) => s.active);
  const trackingPath = useTrackingStore((s) => s.path);
  const loadRoute = useTrackingStore((s) => s.loadRoute);

  // POI Store
  const { pois, load: loadPois } = usePoiStore();

  // Queries & Location
  const { data: trails, isLoading: isLoadingTrails } = useMapTrails();
  const trailId = selectedTrailId ?? currentTrail;
  const { data: trailRoute } = useTrailRoute(trailId);
  const { location, isLoading: isLoadingLocation, requestLocation } = useUserLocation();

  const {
    moveToUser,
    startNavigation,
    resetCamera,
    fitTrail,
    zoomIn,
    zoomOut,
    togglePerspective,
  } = useCameraController({
    mapRef,
    cameraRef,
    location,
    trailRoute,
    cameraMode,
    setCameraMode,
  });

  // Gestione Lifecycle pulizia ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Caricamento POI iniziale
  useEffect(() => {
    loadPois();
  }, [loadPois]);

  // Posizione utente iniziale se non c'è autoFit né centraggio su POI
  useEffect(() => {
    if (autoFitTrailId || poiId || hasAutoLocated.current) return;
    hasAutoLocated.current = true;
    requestLocation().catch(console.warn);
  }, [autoFitTrailId, poiId, requestLocation]);

  // Centra mappa sul POI in maniera sicura
  useEffect(() => {
    if (!poiId || pois.length === 0) return;

    const targetPoi = pois.find((p) => p.id === poiId);

    if (targetPoi) {
      openPoi(targetPoi.id);
      setShowPois(true);
      setCameraMode('free');

      const timer = setTimeout(() => {
        if (isMountedRef.current && cameraRef.current) {
          try {
            cameraRef.current.setCamera({
              centerCoordinate: [targetPoi.longitude, targetPoi.latitude],
              zoomLevel: 16,
              pitch: 0,
              animationDuration: 800,
              animationMode: 'flyTo',
            });
          } catch (e) {
            // Ignora errori nativi
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [poiId, pois, openPoi]);

  // Sincronizzazione rotta tracking
  useEffect(() => {
    if (trailRoute) {
      loadRoute(toCoordinates(trailRoute.coordinates));
    }
  }, [trailRoute, loadRoute]);

  // Gestione Camera in base allo stato di tracking
  useEffect(() => {
    if (!isMountedRef.current) return;
    active ? startNavigation() : resetCamera();
  }, [active, startNavigation, resetCamera]);

  // Centra mappa sul sentiero
  useEffect(() => {
    if (!trailRoute || active || poiId || !isMountedRef.current) return;
    fitTrail();
  }, [trailRoute, active, fitTrail, poiId]);

  useEffect(() => {
    if (!trailRoute || active || poiId) return;
    fitTrail();
    if (autoFitTrailId && trailId === autoFitTrailId) {
      router.setParams({ autoFitTrailId: undefined, poiId: undefined });
    }
  }, [trailRoute, active, fitTrail, autoFitTrailId, trailId, poiId, router]);

  // Apertura dettagli sentiero se passato da params
  useEffect(() => {
    if (!isLoadingTrails && autoFitTrailId && state === 'trail') {
      setTimeout(() => {
        openTrail(autoFitTrailId);
        router.push('/(tabs)/map/trail-detail');
      }, 100);
    }
  }, [autoFitTrailId, isLoadingTrails, state, router, openTrail]);

  // URL dello stile mappa (gestito sia in caso di funzione che di stringa diretta)
  const styleUrl = useMemo(() => {
    const matchedStyle = MAP_STYLES.find((s) => s.key === selectedStyle) ?? MAP_STYLES[0];
    return typeof matchedStyle.styleUrl === 'function'
      ? matchedStyle.styleUrl(MAPTILER_KEY ?? '')
      : matchedStyle.styleUrl;
  }, [selectedStyle]);

  // GeoJSON per Rotta e Tracking
  const routeGeoJson = useMemo(() => toLineGeoJson(trailRoute?.coordinates ?? []), [trailRoute?.coordinates]);
  const trackingGeoJson = useMemo(() => toLineGeoJson(trackingPath.map((p) => [p.lng, p.lat])), [trackingPath]);

  // Coordinate di arrivo
  const finishCoordinate = useMemo(() => {
    const coords = trailRoute?.coordinates;
    if (!coords || coords.length === 0) return null;
    const [longitude, latitude] = coords[coords.length - 1];
    return { longitude, latitude };
  }, [trailRoute?.coordinates]);

  // Callback ultra-sicura per evitare crash da camera unmount
  const handleCameraChanged = async (e: any) => {
    if (!isMountedRef.current || !mapRef.current) return;

    try {
      if (e?.gestures?.isGestureActive && cameraMode !== 'free') {
        setCameraMode('free');
      }

      const zoom = e?.properties?.zoomLevel ?? (await mapRef.current.getZoom());

      if (isMountedRef.current && typeof zoom === 'number') {
        const nextShowPois = zoom >= POI_ZOOM_THRESHOLD;
        const nextShowTrails = zoom >= TRAIL_ZOOM_THRESHOLD;

        setShowPois((prev) => (prev !== nextShowPois ? nextShowPois : prev));
        setShowTrails((prev) => (prev !== nextShowTrails ? nextShowTrails : prev));
      }
    } catch (err) {
      // Intercetta crash nativo di Mapbox durante la transizione
    }
  };

  const handleTrailPress = (id: string) => {
    openTrail(id);
    router.push('/(tabs)/map/trail-detail');
  };

  const handlePoiPress = (id: string) => {
    openPoi(id);
    router.push({ pathname: '/pois/[id]', params: { id } });
  };

  if (isLoadingTrails) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        styleURL={styleUrl}
        logoEnabled={false}
        attributionEnabled
        attributionPosition={{ bottom: 8, left: 8 }}
        onCameraChanged={handleCameraChanged}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: INITIAL_CENTER,
            zoomLevel: INITIAL_ZOOM,
            pitch: INITIAL_PITCH,
          }}
        />

        {/* Tracciato Sentiero */}
        {routeGeoJson && (
          <ShapeSource id="routeSource" shape={routeGeoJson}>
            <LineLayer
              id="routeLineBorder"
              style={{ lineCap: 'round', lineJoin: 'round', lineWidth: 8, lineColor: 'rgba(0, 0, 0, 0.15)' }}
            />
            <LineLayer
              id="routeLine"
              style={{ lineCap: 'round', lineJoin: 'round', lineWidth: 5, lineColor: ROUTE_COLOR }}
            />
          </ShapeSource>
        )}

        {/* Tracciato Registrazione */}
        {trackingGeoJson && (
          <ShapeSource id="trackingSource" shape={trackingGeoJson}>
            <LineLayer
              id="trackingLine"
              style={{ lineCap: 'round', lineJoin: 'round', lineWidth: 4, lineColor: TRACKING_COLOR }}
            />
          </ShapeSource>
        )}

        {/* Marker dei Sentieri */}
        {trails?.map((trail) => (
          <CustomMarker
            key={`trail-${trail.id}`}
            latitude={trail.latitude}
            longitude={trail.longitude}
            icon={<FontAwesome6 name="person-hiking" size={18} color={colors.primaryLight} />}
            color={colors.primaryLight}
            animated={selectedTrailId === trail.id}
            visible={showTrails}
            onPress={() => handleTrailPress(trail.id)}
            size={35}
          />
        ))}

        {/* Marker dei POI */}
        {pois.map((poi) => {
          const { imageUrl, icon } = getPoiMarkerConfig(poi);

          return (
            <CustomMarker
              key={`poi-${poi.id}`}
              latitude={poi.latitude}
              longitude={poi.longitude}
              imageUrl={imageUrl}
              icon={icon}
              color={colors.primaryLight}
              animated={selectedPoiId === poi.id}
              visible={showPois}
              onPress={() => handlePoiPress(poi.id)}
              size={30}
            />
          );
        })}

        {/* Marker di Arrivo */}
        {routeGeoJson && finishCoordinate && (
          <CustomMarker
            key="finish"
            longitude={finishCoordinate.longitude}
            latitude={finishCoordinate.latitude}
            icon={<FontAwesome6 name="flag-checkered" size={15} color={colors.primaryLight} />}
            color={colors.primaryLight}
            size={30}
            animated
            onPress={() => {}}
          />
        )}

        {/* Posizione Utente */}
        {location && (
          <UserLocationMarker
            latitude={location.latitude}
            longitude={location.longitude}
          />
        )}
      </MapView>

      <MapCameraControls
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        togglePerspective={togglePerspective}
        onPress={async () => {
          await requestLocation();
          if (isMountedRef.current) moveToUser();
        }}
        isLoading={isLoadingLocation}
        selected={selectedStyle}
        onSelect={setSelectedStyle}
      />

      {active && <TrackingModal />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});