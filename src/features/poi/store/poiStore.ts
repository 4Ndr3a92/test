import { create } from 'zustand';

import { fetchAllMapPois } from '@/features/map/api/mapApi';
import {  } from '@/features/tracking/store/trackingStore';
import { TrailPOI } from '@/features/tracking/types';

interface PoiState {
  pois: TrailPOI[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  reload: () => Promise<void>;
  clear: () => void;

  getById: (id: string) => TrailPOI | undefined;
}

export const usePoiStore = create<PoiState>((set, get) => ({
  pois: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) {
      return;
    }

    set({ loading: true });

    try {
      const pois = await fetchAllMapPois();

      set({
        pois,
        loaded: true,
        loading: false,
      });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  reload: async () => {
    set({ loading: true });

    try {
      const pois = await fetchAllMapPois();

      set({
        pois,
        loaded: true,
        loading: false,
      });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  clear: () =>
    set({
      pois: [],
      loaded: false,
      loading: false,
    }),

  getById: (id: string) =>
    get().pois.find((p) => p.id === id),
}));