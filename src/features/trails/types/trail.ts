import { Difficulty } from "@/shared/type/trail";

export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  categories: string[];
  latitude?: number;
  longitude?: number;
  altitude?: number;
  image_url: string;
  order: number; // sort_order dalla tabella di join
}


export interface TrailStats {
  durationLabel: string;
  distanceKm: number;
  elevationGainM: number;
  maxAltitudeM: number;
}

export interface TrailDetail {
  id: string;
  name: string;
  difficulty: Difficulty;
  location: string;
  description_long: string;
  categories: string[];
  stats: TrailStats;
  pointsOfInterest: PointOfInterest[];

  ratingAverage: number;
  ratingCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number; // timestamp ms
}


export interface NewReviewPayload {
  trailId: string;
  rating: number;
  comment: string;
}