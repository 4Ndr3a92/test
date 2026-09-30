import { supabase } from "@/config/supabase";
import { Difficulty } from "@/shared/type/trail";
import { PoiCategory } from "../types/exploreFilters";

// ─── Tipi ───────────────────────────────────────────────────────────────────

export interface ExploreTrail {
  id: string;
  name: string;
  description: string;
  location: string;
  distanceKm: number;
  durationMin: number;
  difficulty: Difficulty;
  categories: string[];
  thumbnail_url: string;
  imageUrl: string;
  elevationGainM: number;
}

export interface ExplorePoiData {
  id: string;
  name: string;
  categories: string[];
  location: string;
  description?: string;
  imageUrl?: string;
  thumbnail_url?: string;
}

// ─── Fetch API ──────────────────────────────────────────────────────────────

export const fetchAllTrails = async (): Promise<ExploreTrail[]> => {
  const { data, error } = await supabase
    .from('trails')
    .select('id, name, description, location, distance_km, duration_min, elevation_gain_m, difficulty, thumbnail_url, imageUrl, categories')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    location: row.location ?? '',
    distanceKm: row.distance_km ?? 0,
    durationMin: row.duration_min ?? 0,
    elevationGainM: row.elevation_gain_m ?? 0,
    difficulty: row.difficulty,
    imageUrl: row.imageUrl ?? '',
    thumbnail_url: row.thumbnail_url ?? '',
    categories: row.categories ?? [],
  }));
};

export const fetchAllPois = async (): Promise<ExplorePoiData[]> => {
  const { data, error } = await supabase
    .from('points_of_interest')
    .select('id, name, categories, location, description, image_url, thumbnail_url')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    categories: row.categories ?? [],
    location: row.location ?? '',
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    thumbnail_url: row.thumbnail_url ?? '',
  }));
};