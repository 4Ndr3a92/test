import { supabase } from "@/config/supabase";
import { TrailDetail, Review, NewReviewPayload } from "../types/trail";

export const fetchTrailDetail = async (trailId: string): Promise<TrailDetail> => {
const { data, error } = await supabase
  .from('trails')
  .select(`
    id,
    name,
    difficulty,
    location,
    description,
    categories,
    duration_label,
    duration_min,
    distance_km,
    elevation_gain_m,
    max_altitude_m,
    rating_average,
    rating_count,
    trail_points_of_interest (
      sort_order,
      points_of_interest (
        id,
        name,
        description,
        categories,
        image_url
      )
    )
  `)
  .eq('id', trailId)
  .single();

  if (error) throw error;
  if (!data) throw new Error('Percorso non trovato');

  return {
    id: data.id,
    name: data.name,
    difficulty: data.difficulty,
    location: data.location,
    description_long: data.description ?? '',
    categories: data.categories ?? [],

    stats: {
      durationLabel: data.duration_label,
      distanceKm: data.distance_km,
      elevationGainM: data.elevation_gain_m,
      maxAltitudeM: data.max_altitude_m,
    },
    pointsOfInterest: (data.trail_points_of_interest ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((p: any) => ({
        id: p.points_of_interest.id,
        name: p.points_of_interest.name,
        description: p.points_of_interest.description,
        categories: p.points_of_interest.categories,
        image_url: p.points_of_interest.image_url ?? '',
        order: p.sort_order,
      })),
    ratingAverage: data.rating_average ?? 0,
    ratingCount: data.rating_count ?? 0,
  };
};

export const fetchTrailReviews = async (trailId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, user_id, user_name,user_avatar_url, rating, comment, created_at')
    .eq('trail_id', trailId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    comment: r.comment,
    userAvatarUrl: r.user_avatar_url,
    createdAt: new Date(r.created_at).getTime(),
  }));
};

export const fetchUserReviewForTrail = async (trailId: string, userId: string): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, user_id, user_name,user_avatar_url, rating, comment, created_at')
    .eq('trail_id', trailId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    userName: data.user_name, 
    userAvatarUrl: data.user_avatar_url,
    rating: data.rating,
    comment: data.comment,

    createdAt: new Date(data.created_at).getTime(),
  };
};

export const submitReview = async (payload: NewReviewPayload, userId: string, userName: string, userAvatarUrl?: string ) => {
  const { trailId, rating, comment } = payload;

  const { error } = await supabase
    .from('reviews')
    .insert({ trail_id: trailId, user_id: userId, user_name: userName, rating, comment,user_avatar_url: userAvatarUrl ?? null, });

  if (error) {
    if (error.code === '23505') throw new Error('ALREADY_REVIEWED');
    throw error;
  }
};

export const updateReview = async (trailId: string, reviewId: string, rating: number, comment: string) => {
  const { error } = await supabase
    .from('reviews')
    .update({ rating, comment, edited_at: new Date().toISOString() })
    .eq('id', reviewId);

  if (error) throw error;
};

export const deleteReview = async (trailId: string, reviewId: string) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
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