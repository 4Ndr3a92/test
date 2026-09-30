import { useCallback, useEffect } from 'react';
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from '../services/backgroundLocation';
import { useTrackingStore } from '../store/trackingStore';

export function useTracking() {
  const active = useTrackingStore((s) => s.active);
  const isPaused = useTrackingStore((s) => s.isPaused);
  const startTime = useTrackingStore((s) => s.startTime);
  const pausedTime = useTrackingStore((s) => s.pausedTime);
  const stats = useTrackingStore((s) => s.stats);
  const path = useTrackingStore((s) => s.path);

  const startStore = useTrackingStore((s) => s.start);
  const stopStore = useTrackingStore((s) => s.stop);
  const pauseStore = useTrackingStore((s) => s.pause);
  const resumeStore = useTrackingStore((s) => s.resume);
  const clearPath = useTrackingStore((s) => s.clearPath);
  const clearNotifiedPois = useTrackingStore((s) => s.clearNotifiedPois);
  const reset = useTrackingStore((s) => s.reset);

  // Timer per il conteggio del tempo effettivo di attività
  useEffect(() => {
    // Se non è attivo o È IN PAUSA, il timer NON deve girare
    if (!active || isPaused || !startTime) return;

    const timer = setInterval(() => {
      // Sottraiamo sia il tempo di inizio che il totale del tempo passato in pausa
      const now = Date.now();
      const elapsed = Math.max(0, Math.floor((now - startTime - pausedTime) / 1000));

      useTrackingStore.setState((state) => ({
        stats: {
          ...state.stats,
          elapsedSeconds: elapsed,
        },
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [active, isPaused, startTime, pausedTime]);

  const startTracking = useCallback(async () => {
    if (active) return;

    clearPath();
    clearNotifiedPois();
    startStore();

    try {
      await startBackgroundTracking();
    } catch (e) {
      stopStore();
      throw e;
    }
  }, [active, startStore, stopStore, clearPath, clearNotifiedPois]);

  const stopTracking = useCallback(async () => {
    if (!active) return;

    await stopBackgroundTracking();
    stopStore();
  }, [active, stopStore]);

  const pauseTracking = useCallback(async () => {
    if (!active || isPaused) return;

    await stopBackgroundTracking(); // Ferma gli aggiornamenti GPS in background
    pauseStore();
  }, [active, isPaused, pauseStore]);

  const resumeTracking = useCallback(async () => {
    if (!active || !isPaused) return;

    resumeStore();
    await startBackgroundTracking(); // Riavvia il tracciamento GPS
  }, [active, isPaused, resumeStore]);

  const clear = useCallback(async () => {
    if (active) {
      await stopBackgroundTracking();
    }
    reset();
  }, [active, reset]);

  return {
    active,
    isPaused,
    stats,
    path,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    clear,
  };
}