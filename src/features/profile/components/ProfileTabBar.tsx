import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { colors, spacing } from '@/shared/theme';

export type ProfileTab = 'archive' | 'reviews';

type Props = {
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
};

export const ProfileTabs: React.FC<Props> = ({
  activeTab,
  onChangeTab,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'archive' && styles.tabActive,
        ]}
        onPress={() => onChangeTab('archive')}
      >
        <Ionicons
          name={
            activeTab === 'archive'
              ? 'bookmark'
              : 'bookmark-outline'
          }
          size={18}
          color={
            activeTab === 'archive'
              ? colors.primary
              : colors.textMuted
          }
        />

        <Text
          style={[
            styles.tabLabel,
            activeTab === 'archive' &&
              styles.tabLabelActive,
          ]}
        >
          {t('profile.archive')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'reviews' && styles.tabActive,
        ]}
        onPress={() => onChangeTab('reviews')}
      >
        <Ionicons
          name={
            activeTab === 'reviews'
              ? 'chatbubble'
              : 'chatbubble-outline'
          }
          size={18}
          color={
            activeTab === 'reviews'
              ? colors.primary
              : colors.textMuted
          }
        />

        <Text
          style={[
            styles.tabLabel,
            activeTab === 'reviews' &&
              styles.tabLabelActive,
          ]}
        >
          {t('profile.reviewsTab')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabActive: {
    borderBottomColor: colors.primary,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },

  tabLabelActive: {
    color: colors.primary,
  },
});