import { useState, useEffect } from 'react';

// Coordinate del Parco dell'Alcantara
const LATITUDE = 37.8794;
const LONGITUDE = 15.1633;

// Interfaccia per i dati meteo formattati che esponiamo al componente
export interface WeatherData {
  location: string;
  description: string;
  temp: string;
  minTemp: string;
  emoji: string;
}

// Interfaccia per la risposta JSON di Open-Meteo (solo i campi che ci interessano)
interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
}

function mapWmoCode(code: number): { emoji: string; desc: string } {
  if (code === 0) return { emoji: '☀️', desc: 'Cielo sereno' };
  if (code >= 1 && code <= 3) return { emoji: '🌤️', desc: 'Nuvolosità variabile' };
  if (code >= 45 && code <= 48) return { emoji: '🌫️', desc: 'Nebbia o bruma' };
  if (code >= 51 && code <= 55) return { emoji: '🌧️', desc: 'Pioggerellina' };
  if (code >= 61 && code <= 65) return { emoji: '🌧️', desc: 'Pioggia' };
  if (code >= 71 && code <= 77) return { emoji: '❄️', desc: 'Neve' };
  if (code >= 80 && code <= 82) return { emoji: '🌦️', desc: 'Rovesci di pioggia' };
  if (code >= 95 && code <= 99) return { emoji: '⛈️', desc: 'Temporale' };
  return { emoji: '☀️', desc: 'Soleggiato' };
}

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Rome`
        );

        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati meteo');
        }

        const data: OpenMeteoResponse = await response.json();

        const currentTemp = Math.round(data.current.temperature_2m);
        const minTemp = Math.round(data.daily.temperature_2m_min[0]);
        const wmoCode = data.current.weather_code;
        
        const { emoji, desc } = mapWmoCode(wmoCode);

        setWeatherData({
          location: "Parco dell'Alcantara",
          description: desc,
          temp: `${currentTemp}°`,
          minTemp: `${minTemp}°`,
          emoji: emoji,
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Impossibile caricare il meteo");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return { weatherData, loading, error };
}