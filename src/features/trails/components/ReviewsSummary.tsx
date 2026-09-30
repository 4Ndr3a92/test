import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StarRating } from './StarRating';
import { colors, spacing, typography } from '../../../shared/theme';

interface Props {
  average: number;
  count: number;
}

export const ReviewsSummary: React.FC<Props> = ({ average, count }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.bigNumber}>{average.toFixed(1)}</Text>
      <View>
        <StarRating rating={average} size={18} />
        <Text style={styles.count}>
          {t(count === 1 ? 'trailDetail.reviews.countOne' : 'trailDetail.reviews.count', { count })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  bigNumber: { fontSize: 36, fontWeight: '800', color: colors.textPrimary },
  count: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});