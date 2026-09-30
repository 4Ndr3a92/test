import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../../../shared/theme';
import { Difficulty } from '@/shared/type/trail';
import { Badge } from '@/shared/components/badge';


interface Props {
  name: string;
  difficulty: Difficulty;
  location: string;
}

export const DetailHeader: React.FC<Props> = ({ name, difficulty, location }) => (
  <View style={styles.container}>
    <Badge difficulty={difficulty} />
    <Text style={[typography.heroTitle, styles.name]}>{name}</Text>
    <View style={styles.row}>
      <Ionicons name="location" size={15} color={colors.primary} />
      <Text style={styles.meta}>{location}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  name: { color: colors.textPrimary, marginTop: spacing.sm, fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  meta: { color: colors.textSecondary, fontSize: 14 },
});