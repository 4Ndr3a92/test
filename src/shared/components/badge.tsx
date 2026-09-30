import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, radius, spacing, typography } from '../theme';
import { Difficulty } from '../type/trail';


interface Props {
  difficulty: Difficulty;
  variant?: 'filled' | 'outlined';
}

const config: Record<Difficulty, { bg: string; text: string; dot: string; key: string }> = {
  Facile:    { bg: colors.easyBg,   text: colors.easyText,   dot: colors.easy,   key: 'difficulty.easy' },
  Medio:     { bg: colors.mediumBg, text: colors.mediumText, dot: colors.medium, key: 'difficulty.medium' },
  Difficile: { bg: colors.hardBg,   text: colors.hardText,   dot: colors.hard,   key: 'difficulty.hard' },
};

export const Badge: React.FC<Props> = ({ difficulty, variant = 'filled' }) => {
  const { t } = useTranslation();
  const c = config[difficulty];

  return (
    <View style={[
      styles.badge,
      variant === 'filled'
        ? { backgroundColor: c.bg }
        : { backgroundColor: 'transparent', borderWidth: 1, borderColor: c.dot },
    ]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[typography.label, { color: c.text }]}>{t(c.key)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full,
  },
  dot: { width: 7, height: 7, borderRadius: 99 },
});