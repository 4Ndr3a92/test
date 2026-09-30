import { useMapStore } from '@/features/map/store/mapStore';
import { useTracking } from './useTracking';

export const useStopTrail = () => {
  const { stopTracking } = useTracking();
  const stopNav = useMapStore((s) => s.stopNav);

  return async () => {
    await stopTracking();
    stopNav();
    // NOTA: 'clear()' va chiamato solo dopo aver salvato la traccia o nella pagina di riepilogo
  };
};