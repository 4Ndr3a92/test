import { create } from 'zustand';
import { TrackingStats } from '../types';
import { Coordinate } from '@/shared/type/trail';

interface TrackingState {
  active: boolean;
  isPaused: boolean;
  offRoute: boolean;
  setOffRoute: (value: boolean) => void;
  route: Coordinate[];
  path: Coordinate[];
  startTime: number | null;
  pausedTime: number; // Accumulatore del tempo trascorso in pausa
  pauseStartTimestamp: number | null; // Timestamp di quando è iniziata la pausa
  notifiedPois: string[];
  stats: TrackingStats;
  
  setStartTime: (time: number) => void;
  setStats: (stats: TrackingStats) => void;
  loadRoute: (route: Coordinate[]) => void;

  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  addPoint: (point: Coordinate) => void;
  addNotifiedPoi: (id: string) => void;
  isPoiNotified: (id: string) => boolean;
  clearPath: () => void;
  clearNotifiedPois: () => void;
  reset: () => void;
}

export const EMPTY_TRACKING_STATS: TrackingStats = {
  elapsedSeconds: 0,
  distanceKm: 0,
  speedKmH: 0,
  paceMinPerKm: 0,
  elevationGainM: 0,
  maxAltitudeM: 0,
};

export const useTrackingStore = create<TrackingState>((set, get) => ({
  active: false,
  isPaused: false,
  startTime: null,
  pausedTime: 0,
  pauseStartTimestamp: null,
  stats: EMPTY_TRACKING_STATS,
  route: [],
  path: [],
  offRoute: false,
  notifiedPois: [],

  setOffRoute: (value: boolean) => set({ offRoute: value }),

  loadRoute: (route) => set({ route }),

  start: () =>
    set({
      active: true,
      isPaused: false,
      startTime: Date.now(),
      pausedTime: 0,
      pauseStartTimestamp: null,
      path: [],
      notifiedPois: [],
      offRoute: false,
      stats: EMPTY_TRACKING_STATS,
    }),

  pause: () => {
    const { isPaused, active } = get();
    if (!active || isPaused) return;

    set({
      isPaused: true,
      pauseStartTimestamp: Date.now(),
    });
  },

  resume: () => {
    const { isPaused, active, pauseStartTimestamp, pausedTime } = get();
    if (!active || !isPaused) return;

    const additionalPausedTime = pauseStartTimestamp ? Date.now() - pauseStartTimestamp : 0;

    set({
      isPaused: false,
      pausedTime: pausedTime + additionalPausedTime,
      pauseStartTimestamp: null,
    });
  },

  stop: () =>
    set({
      active: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      pauseStartTimestamp: null,
      stats: EMPTY_TRACKING_STATS,
    }),

  setStats: (stats) => set({ stats }),

  addPoint: (point) => {
    // Non aggiungere punti GPS al percorso se l'utente è in pausa
    if (get().isPaused) return;

    set((state) => ({
      path: [...state.path, point],
    }));
  },

  clearPath: () => set({ path: [] }),

  addNotifiedPoi: (id) =>
    set((state) => ({
      notifiedPois: [...state.notifiedPois, id],
    })),

  isPoiNotified: (id) => get().notifiedPois.includes(id),

  clearNotifiedPois: () => set({ notifiedPois: [] }),

  reset: () =>
    set({
      active: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      pauseStartTimestamp: null,
      path: [],
      notifiedPois: [],
      route: [],
      offRoute: false,
      stats: EMPTY_TRACKING_STATS,
    }),

  setStartTime: (time) => set({ startTime: time }),
}));