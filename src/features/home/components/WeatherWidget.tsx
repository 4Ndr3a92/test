import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../hooks/useWeather';
import { colors } from '@/shared/theme';

export default function WeatherWidget() {
  const { weatherData, loading, error } = useWeather();

  return (
    <View style={styles.weatherContainer}>
      <View style={styles.weatherCard}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Aggiornamento meteo...</Text>
          </View>
        ) : error || !weatherData ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>{error || "Meteo non disponibile"}</Text>
          </View>
        ) : (
          <>
            <View style={styles.weatherLeft}>
              <View style={styles.weatherIconPlaceholder}>
                <Text style={{ fontSize: 32 }}>{weatherData.emoji}</Text>
              </View>
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherLocation}>{weatherData.location}</Text>
                <Text style={styles.weatherDesc}>{weatherData.description}</Text>
              </View>
            </View>
            <View style={styles.weatherRight}>
              <Text style={styles.tempText}>{weatherData.temp}</Text>
              <Text style={styles.tempSub}>min. {weatherData.minTemp}</Text>
            </View>
     
   
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    alignItems: 'center',
    marginTop: -55,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  weatherCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    width: '100%',
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 13,
    color: '#D32F2F',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIconPlaceholder: {
    marginRight: 12,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherLocation: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  weatherDesc: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 16,
  },
  weatherRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  tempText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  tempSub: {
    fontSize: 11,
    color: '#8E8E93',
  },
  arrowIcon: {
    marginLeft: 4,
  },
});