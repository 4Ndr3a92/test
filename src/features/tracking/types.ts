export interface TrackingPoint {
  latitude: number;
  longitude: number;

}

export interface TrackingStats {
  elapsedSeconds: number;
  distanceKm: number;
  speedKmH: number;
  paceMinPerKm: number;
  elevationGainM: number;
  maxAltitudeM: number;
}



export interface TrailPOI {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  categories: string[];
 
}
