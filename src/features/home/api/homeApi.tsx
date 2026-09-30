import { supabase } from "@/config/supabase";
import { Difficulty, Trail } from "@/shared/type/trail";

export interface CardTrail {
  id: string;
  name: string;
  description: string;
  location: string;
  distanceKm: number;
  durationMin: number;
  thumbnail_url: number;
  imageUrl: string;
  difficulty: Difficulty;
  categories: string[];
}




export const mapRowToTrail = (row: any): CardTrail => ({
  id: row.id,
  name: row.name,
  description: row.description ?? '',
  location: row.location,
  distanceKm: row.distance_km,
  durationMin: row.duration_min,
  difficulty: row.difficulty,
  thumbnail_url: row.thumbnail_url,
  imageUrl: row.imageUrl,
  categories: row.categories
});

export const fetchAllHomeTrails = async (): Promise<CardTrail[]> => {
  const { data, error } = await supabase
    .from('trails')
    .select('id, name, description, location, distance_km, duration_min, difficulty,thumbnail_url,imageUrl,categories')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapRowToTrail);
};

export const fetchTrailsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('trails')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count ?? 0;
};


export const fetchIsFavorite = async (trailId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('trail_id')
    .eq('trail_id', trailId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export const toggleTrailFavorite = async (trailId: string, userId: string, isFavorite: boolean) => {
  if (isFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('trail_id', trailId)
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({ trail_id: trailId, user_id: userId });
    if (error) throw error;
  }
};