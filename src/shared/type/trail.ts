export type Difficulty = 'Facile' | 'Medio' | 'Difficile';

export type Coordinate = {
  lat: number; 
  lng: number;
  altitude?: number

}



export interface Trail {
  id: string;
  name: string;
  description: string;
  location: string;
  distanceKm: number;
  durationMin: number;
  difficulty: Difficulty;
  thumbnail_url: string;
  imageUrl: string;
  waypoints: Coordinate[];

}