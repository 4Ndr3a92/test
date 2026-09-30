import { useMapStore } from '@/features/map/store/mapStore';
import { Coordinate } from '@/shared/type/trail';
import { useTrackingStore } from '../store/trackingStore';
import { useTracking } from './useTracking';

export const useStartTrail = () => {
  const { startTracking } = useTracking();
  const startNav = useMapStore((s) => s.startNav);
  const loadRoute = useTrackingStore((s) => s.loadRoute);

  return async (id: string, routePoints: Coordinate[] = []) => {
    try {
      if (routePoints.length > 0) {
        loadRoute(routePoints);
      }
      await startTracking();
      startNav(id);
    } catch (error) {
      console.error('Impossibile avviare il tracciamento del percorso:', error);
      // Evita di avviare l'UI di navigazione se l'avvio del tracking fallisce (es. assenza permessi)
    }
  };
};