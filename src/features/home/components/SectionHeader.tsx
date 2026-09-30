import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '@/shared/theme';

type Props = {
  title: string;
  actionText?: string;
  onPressAction?: () => void;
};

export const SectionHeader: React.FC<Props> = ({
  title,
  actionText,
  onPressAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {actionText && onPressAction && (
        <TouchableOpacity
          style={styles.action}
          onPress={onPressAction}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>
            {actionText}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    flex: 1,
  },

  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});