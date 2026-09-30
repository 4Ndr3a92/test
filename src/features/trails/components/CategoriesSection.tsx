import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography } from '../../../shared/theme';

export const CategoriesSection: React.FC<{ categories: string[] }> = ({ categories }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={[typography.sectionTitle, styles.title]}>{t('trailDetail.categories')}</Text>
      <View style={styles.row}>
        {categories.map((cat) => (
          <View key={cat} style={styles.pill}>
            <Text style={styles.pillText}>{cat}</Text>
          </View>
        ))}
      </View>
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
  title: { color: colors.textPrimary, marginBottom: spacing.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: {
    backgroundColor: '#E8F5E9',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  pillText: { color: colors.easyText, fontSize: 13, fontWeight: '600' },
});