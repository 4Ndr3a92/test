import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TrailStats } from '../types/trail';
import { colors, spacing, radius, typography } from '../../../shared/theme';

interface Props {
  stats: TrailStats;
}

export const StatsGrid: React.FC<Props> = ({ stats }) => {
  const { t } = useTranslation();

  const items = [
    { icon: 'time-outline' as const, label: t('trailDetail.duration'), value: stats.durationLabel },
    { icon: 'walk-outline' as const, label: t('trailDetail.distance'), value: `${stats.distanceKm} ${t('common.km')}` },
    { icon: 'trending-up-outline' as const, label: t('trailDetail.elevationGain'), value: `+${stats.elevationGainM} m` },
    { icon: 'triangle-outline' as const, label: t('trailDetail.maxAltitude'), value: `${stats.maxAltitudeM} m` },
  ];

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Ionicons name={item.icon} size={22} color={colors.primary} />
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[typography.cardTitle, styles.value]}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md
  },
  card: {
    flexBasis: '20%',
    flexGrow: 1,



    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 1,
  },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 17, color: colors.textPrimary },
});