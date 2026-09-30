import { colors, radius, spacing, typography } from '@/shared/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useStopTrail } from '@/features/tracking/hooks/useStopTrail';
import { useTracking } from '@/features/tracking/hooks/useTracking';

interface Props {}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const formatPace = (minPerKm: number): string => {
  if (!isFinite(minPerKm) || minPerKm === 0) return "--'--\"";
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}'${String(s).padStart(2, '0')}"`;
};

export const TrackingModal: React.FC<Props> = () => {
  const { t } = useTranslation();
  const { stats, isPaused, pauseTracking, resumeTracking } = useTracking();
  const onStop = useStopTrail();

  const handleTogglePause = () => {
    if (isPaused) {
      resumeTracking();
    } else {
      pauseTracking();
    }
  };

  const handleStop = () => {
    Alert.alert(
      t('map.stopTrailTitle', 'Interrompi sentiero'),
      t('map.stopTrailMessage', 'Sei sicuro di voler interrompere la registrazione del percorso?'),
      [
        { text: t('common.cancel', 'Annulla'), style: 'cancel' },
        { 
          text: t('map.stopTrailConfirm', 'Termina'), 
          style: 'destructive', 
          onPress: () => {
            onStop(); 
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.panel}>
      {/* Statistiche principali */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(stats.elapsedSeconds)}</Text>
          <Text style={styles.statLabel}>{t('map.tracking.time', 'Tempo')}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.distanceKm.toFixed(2)}</Text>
          <Text style={styles.statLabel}>{t('map.tracking.distance', 'Distanza')} (km)</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatPace(stats.paceMinPerKm)}</Text>
          <Text style={styles.statLabel}>{t('map.tracking.pace', 'Passo')}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.speedKmH.toFixed(1)}</Text>
          <Text style={styles.statLabel}>{t('map.tracking.speed', 'Velocità')} (km/h)</Text>
        </View>
      </View>

      {/* Controlli Azione: Pausa e Stop */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={[styles.button, isPaused ? styles.resumeButton : styles.pauseButton]} 
          onPress={handleTogglePause}
        >
          <Ionicons 
            name={isPaused ? "play" : "pause"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.buttonText}>
            {isPaused 
              ? t('map.resumeTrail', 'Riprendi') 
              : t('map.pauseTrail', 'Pausa')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
          <Ionicons name="stop" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{t('map.stopTrail', 'Termina')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: colors.border },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  pauseButton: {
    backgroundColor: '#FF9800', // Arancione per la pausa
  },
  resumeButton: {
    backgroundColor: '#4CAF50', // Verde per riprendere
  },
  stopButton: {
    backgroundColor: colors.primary, // Rosso/Primary per terminare
  },
  buttonText: { ...typography.buttonText, color: '#FFFFFF' },
});