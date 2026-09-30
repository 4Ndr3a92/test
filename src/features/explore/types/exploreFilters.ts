import { Difficulty } from "@/shared/type/trail";
import { ExploreTrail } from "../api/exploreApi";

// ─── Tipi per i POI e le Tab di Categoria ────────────────────────────────────

export type PoiCategory = 'Natura' | 'Panoramici' | 'Sosta';

// Definiamo la Tab selezionabile (Tutti, Percorsi o Categoria POI)
export type ExploreTab = 'all' | 'route' | PoiCategory;

export interface ExplorePoi {
  id: string;
  type: 'poi';
  name: string;
  categories: string[];
  location: string;
  imageUrl?: string;
  thumbnail_url?: string;
  description?: string
}

// Tipo unificato (Unione Discriminata) per gestire Trails e POI insieme
export type ExploreItem = (ExploreTrail & { type: 'route' }) | ExplorePoi;

// ─── Filtri e Ordinamento ───────────────────────────────────────────────────

export type SortOption = 'recommended' | 'distanceAsc' | 'distanceDesc' | 'durationAsc' | 'ratingDesc';

export interface ExploreFilters {
  searchQuery: string;
  selectedTab: ExploreTab;
  difficulties: Difficulty[];
  categories: string[];
  distanceRange: [number, number]; // km
  durationRange: [number, number]; // minuti
  elevationRange: [number, number]; // metri
  sort: SortOption;
}

export const DEFAULT_FILTERS: ExploreFilters = {
  searchQuery: '',
  selectedTab: 'all',
  difficulties: [],
  categories: [],
  distanceRange: [0, 50],
  durationRange: [0, 1080],
  elevationRange: [0, 2000],
  sort: 'recommended',
};

export const FILTER_BOUNDS = {
  distance: { min: 0, max: 50, step: 0.5, unit: 'km' },
  duration: { min: 0, max: 1080, step: 15, unit: 'min' },
  elevation: { min: 0, max: 2000, step: 50, unit: 'm' },
};