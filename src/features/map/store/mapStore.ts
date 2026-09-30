import { create } from 'zustand';

export type MapStyleKey = 'outdoor' | 'satellite' | 'streets' | 'topo';

export interface MapStyleOption {
  key: MapStyleKey;
  label: string;
  icon: string;
  styleUrl: (key: string) => string;
}

export const MAP_STYLES: MapStyleOption[] = [
  {
    key: 'outdoor',
    label: 'Outdoor',
    icon: 'trail-sign-outline',
    styleUrl: (k) => `https://api.maptiler.com/maps/01a0ce72-336e-71e7-8906-198d0d6d06fc/style.json?key=${k}`,
  },
  {
    key: 'satellite',
    label: 'Satellite',
    icon: 'globe-outline',
    styleUrl: (k) => `https://api.maptiler.com/maps/01a0d356-3da9-7e29-91e7-b1630f0647ec/style.json?key=${k}`,
  },
  {
    key: 'streets',
    label: 'Strade',
    icon: 'car-outline',
    styleUrl: (k) => `https://api.maptiler.com/maps/streets-v2/style.json?key=${k}`,
  },
  {
    key: 'topo',
    label: 'Topo',
    icon: 'layers-outline',
    styleUrl: (k) => `https://api.maptiler.com/maps/01a0ce3d-2411-7706-b0c1-ac7d2f90e65c/style.json?key=${k}`,
  },
];

export type MapStateName = 'none' | 'trail' | 'tracking' | 'poi';

interface MapState {
  // Stili Mappa
  selectedStyle: MapStyleKey;
  setSelectedStyle: (style: MapStyleKey) => void;
  
  state: MapStateName;
  prevState: MapStateName;
  currentTrail: string | null;
  selectedTrailId: string | null;
  selectedPoiId: string | null;
  snapIndex: number;
  
  // Azioni UI semplificate per Expo Router
  openTrail: (id: string) => void;
  openPoi: (id: string) => void;
  startNav: (id: string) => void;
  stopNav: () => void;
  setNoneState: () => void; // Chiamato quando si chiude il foglio dall'alto/bas
}

export const useMapStore = create<MapState>((set) => ({
  // Stati Iniziali 

  selectedStyle: 'outdoor',
  state: 'none',
  prevState: 'none',
  currentTrail: null,
  selectedTrailId: null,
  selectedPoiId: null,
  snapIndex: -1,
  setSelectedStyle: (style) => set({ selectedStyle: style }),

  openTrail: (id) => set({
    selectedTrailId: id,
    selectedPoiId: null,
    state: 'trail',
    prevState: 'none',
  }),

  openPoi: (id) => set((current) => ({
    selectedPoiId: id,
    state: 'poi',
    prevState: current.state === 'poi' ? current.prevState : current.state,
  })),

  startNav: (id) => set({
    state: 'tracking',
    prevState: 'none',
    currentTrail: id,
    selectedTrailId: null,
    selectedPoiId: null,
  }),

  stopNav: () => set({
    state: 'none',
    prevState: 'none',
    selectedTrailId: null,
    currentTrail: null,
    selectedPoiId: null,
  }),

  setNoneState: () => set({
    state: 'none',
    prevState: 'none',
    selectedPoiId: null,
    selectedTrailId: null,
  })
}));