import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  radius,
  spacing,
  typography,
} from '@/shared/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText: string;
  onPress: () => void;
};

export const ProfileEmptyState: React.FC<Props> = ({
  icon,
  title,
  subtitle,
  buttonText,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={48}
        color={colors.textMuted}
      />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },

  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },

  subtitle: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },

  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});