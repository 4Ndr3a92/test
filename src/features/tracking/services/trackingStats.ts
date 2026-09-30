import { Coordinate } from '@/shared/type/trail';
import { TrackingStats } from '../types';
import { haversine } from '../utils/distance';
import { speedToPace } from '../utils/pace';

export class TrackingStatsCalculator {
  private lastPoint: Coordinate | null = null;
  private distanceKm = 0;
  private elevationGain = 0;
  private maxAltitude = 0;

  start() {
    this.lastPoint = null;
    this.distanceKm = 0;
    this.elevationGain = 0;
    this.maxAltitude = 0;
  }

  reset() {
    this.start();
  }

  /**
   * Calcola le statistiche aggiornate.
   * @param point Nuova coordinata GPS
   * @param currentElapsedSeconds Tempo trascorso effettivo dal timer dello store
   */
  update(point: Coordinate, currentElapsedSeconds: number): TrackingStats {
    if (this.lastPoint) {
      const distance = haversine(this.lastPoint, point);

      // Filtra il rumore di posizione GPS (< 3-5 metri)
      if (distance >= 4) {
        this.distanceKm += distance / 1000;

        // Gestione dislivello e altitudine
        if (point.altitude != null && this.lastPoint.altitude != null) {
          const gain = point.altitude - this.lastPoint.altitude;

          // Filtra variazioni microscopiche di altitudine (Jitter GPS)
          if (gain >= 2) {
            this.elevationGain += gain;
          }

          this.maxAltitude = Math.max(this.maxAltitude, point.altitude);
        }

        this.lastPoint = point;
      }
    } else {
      this.lastPoint = point;

      if (point.altitude != null) {
        this.maxAltitude = point.altitude;
      }
    }

    // Ore trascese dal timer dello store (evita sfasamenti tra pausa e movimento)
    const elapsedHours = currentElapsedSeconds / 3600;

    // Calcolo della velocità media reale
    const speedKmH = elapsedHours > 0 ? this.distanceKm / elapsedHours : 0;

    return {
      elapsedSeconds: currentElapsedSeconds,
      distanceKm: Number(this.distanceKm.toFixed(2)),
      speedKmH: Number(speedKmH.toFixed(1)),
      paceMinPerKm: speedToPace(speedKmH),
      elevationGainM: Math.round(this.elevationGain),
      maxAltitudeM: Math.round(this.maxAltitude),
    };
  }
}