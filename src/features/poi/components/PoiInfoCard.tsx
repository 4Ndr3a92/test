import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/shared/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export const PoiInfoCard: React.FC<Props> = ({ icon, label, value }) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={22} color={colors.primary} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});