/**
 * Converte una velocità (km/h) in passo (min/km).
 * Ritorna 0 se la velocità è troppo bassa.
 */
export function speedToPace(speedKmH: number): number {
  if (speedKmH <= 0.5) return 0;

  return 60 / speedKmH;
}

/**
 * Formatta un passo in mm:ss /km
 *
 * Es:
 * 5.5 -> "5:30 /km"
 */
export function formatPace(paceMinPerKm: number): string {
  if (paceMinPerKm <= 0 || !Number.isFinite(paceMinPerKm)) {
    return '--:-- /km';
  }

  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
}

/**
 * Formatta una velocità.
 *
 * Es:
 * 4.53 -> "4.5 km/h"
 */
export function formatSpeed(speedKmH: number): string {
  if (speedKmH <= 0 || !Number.isFinite(speedKmH)) {
    return '0.0 km/h';
  }

  return `${speedKmH.toFixed(1)} km/h`;
}

/**
 * Formatta una durata.
 *
 * Es:
 * 95 -> "01:35"
 * 3670 -> "1:01:10"
 */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 0 || !Number.isFinite(totalSeconds)) {
    return '00:00';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes
    .toString()
    .padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}