
import { supabase } from "@/config/supabase";
import { TrailPOI } from "@/features/tracking/types";

import { Coordinate } from "@/shared/type/trail";




export interface MapTrail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  waypoints: Coordinate[];
}



export interface TrailRoute {
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
  elevationGainM: number;
  maxAltitudeM: number;
}

export const fetchMapTrails = async (): Promise<MapTrail[]> => {
  const { data, error } = await supabase
    .from('trails')
    .select(`
      id,
      name,
      difficulty,
      latitude,
      longitude,
      waypoints,
      trail_points_of_interest (
        sort_order,
        points_of_interest (
          id,
          name,
          description,
          image_url,
          latitude,
          longitude
      
        )
      )
    `);
 
  if (error) throw error;

  return (data ?? []).map((trail: any) => ({
    id: trail.id,
    name: trail.name,
    difficulty: trail.difficulty,
    latitude: trail.latitude,
    longitude: trail.longitude,
    waypoints: trail.waypoints ?? [],

    pointsOfInterest: (trail.trail_points_of_interest ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((poi: any) => ({
        id: poi.points_of_interest.id,
        name: poi.points_of_interest.name,
        description: poi.points_of_interest.description,
        latitude: poi.points_of_interest.latitude ?? 0,
        longitude: poi.points_of_interest.longitude ?? 0,
        image_url: poi.points_of_interest.image_url ?? '',
        order: poi.sort_order,
      })),
  }));
};

/**
 * Legge il tracciato direttamente dal campo JSONB trails.route.
 * Nessuna tabella route_points necessaria.
 */
export const fetchTrailRoute = async (trailId: string): Promise<TrailRoute | null> => {
  const { data, error } = await supabase
    .from('trails')
    .select('route, distance_km, duration_min, elevation_gain_m, max_altitude_m')
    .eq('id', trailId)
    .single();

  if (error || !data?.route) return null;

  const coordinates: [number, number][] = data.route.geometry?.coordinates ?? [];

  return {
    coordinates,
    distanceKm:    data.distance_km    ?? 0,
    durationMin:   data.duration_min   ?? 0,
    elevationGainM: data.elevation_gain_m ?? 0,
    maxAltitudeM:  data.max_altitude_m ?? 0,
  };
};

export const fetchAllMapPois = async (): Promise<TrailPOI[]> => {
  const { data, error } = await supabase
    .from('points_of_interest')
    .select(`id, name, description, image_url, latitude, longitude,categories`)
    .not('latitude', 'is', null);

  if (error) throw error;
  return (data ?? [])
    .filter((row: any) => row.latitude)
    .map((row: any) => ({
      id:       row.id,
      name:    row.name,
      description:    row.description,
      image_url: row.image_url ?? '',
      latitude: row.latitude,
      longitude: row.longitude,
      categories: row.categories,
    }));
};