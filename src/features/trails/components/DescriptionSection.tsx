import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing, typography } from '@/shared/theme';

export const DescriptionSection: React.FC<{ description_long: string }> = ({ description_long }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={[typography.sectionTitle, styles.title]}>{t('trailDetail.description')}</Text>
      <Text style={styles.text}>{description_long}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  title: { color: colors.textPrimary, marginBottom: spacing.sm },
  text: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
});