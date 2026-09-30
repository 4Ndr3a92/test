import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors, spacing } from '@/shared/theme';
import { ProfileFeaturedSection } from './ProfileFeaturedSection';
import { ProfileEmptyState } from './ProfileEmptyState';

import { CardTrail } from '@/features/home/api/homeApi';



type Props = {
  loading: boolean;
  trails: CardTrail[];
  favoriteIds: string[];
  onPressTrail: (trailId: string) => void;
  onToggleFavorite: (trailId: string) => void;
};

export const ProfileArchive: React.FC<Props> = ({
  loading,
  trails,
  favoriteIds,
  onPressTrail,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={colors.primary}
          style={styles.loader}
        />
      </View>
    );
  }

  if (trails.length === 0) {
    return (
      <View style={styles.container}>
        <ProfileEmptyState
          icon="bookmark-outline"
          title={t('profile.emptyArchiveTitle')}
          subtitle={t('profile.emptyArchiveSubtitle')}
          buttonText={t('profile.emptyArchiveCta')}
          onPress={() => router.push('/(tabs)/explore')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileFeaturedSection
        trails={trails}
        favoriteIds={favoriteIds}
        onPressTrail={onPressTrail}
        onToggleFavorite={onToggleFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  loader: {
    marginTop: spacing.xxl,
  },
});