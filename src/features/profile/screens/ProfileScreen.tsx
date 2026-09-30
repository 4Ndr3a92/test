import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useMapStore } from '@/features/map/store/mapStore';
import { useFavoriteIds } from '@/shared/hooks/useFavoriteIds';
import { useToggleFavorite } from '@/shared/hooks/useToggleFavorite';
import { colors } from '@/shared/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { EditProfileModal } from '../components/EditProfileModal';
import { ProfileArchive } from '../components/ProfileArchive';
import { ProfileReviews } from '../components/ProfileReviews';
import { ProfileTopBar } from '../components/ProfileTopBar';
import { useFavoriteTrails } from '../hooks/useFavoriteTrails';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileTab, ProfileTabs } from '../components/ProfileTabBar';

// Importazione dei nuovi hook del profilo
import {
  useProfileReviews,
  useDeleteProfileReview,
  useUpdateProfileReview,
  ProfileReview,
} from '../hooks/useProfileReviews';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();

  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  const [activeTab, setActiveTab] = useState<ProfileTab>('archive');
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { data: favoriteIds = [] } = useFavoriteIds();
  const toggleFavoriteMutation = useToggleFavorite();

  const { data: favoriteTrails, isLoading: isLoadingFavorites } =
    useFavoriteTrails();

  // Nuovi hook per recensioni del profilo
  const { data: userReviews, isLoading: isLoadingReviews } = useProfileReviews();
  const deleteReviewMutation = useDeleteProfileReview();
  const updateReviewMutation = useUpdateProfileReview();

  const openTrail = useMapStore((s) => s.openTrail);

  if (!user) return null;

  const displayName =
    user.user_metadata?.full_name ?? user.email ?? 'Utente';

  const photoURL = user.user_metadata?.avatar_url;

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('it-IT', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => logoutMutation.mutate(),
        },
      ]
    );
  };

  const handleToggleFavorite = (trailId: string) => {
    toggleFavoriteMutation.mutate({
      trailId,
      isFavorite: favoriteIds.includes(trailId),
    });
  };

  const handleOpenTrail = (trailId: string) => {
    router.push({
      pathname: '/(tabs)/map',
      params: {
        autoFitTrailId: trailId,
      },
    });

    openTrail(trailId);
  };

  // Gestione eliminazione recensione
  const handleDeleteReview = (reviewId: string) => {
    deleteReviewMutation.mutate(reviewId, {
      onError: (err) => {
        Alert.alert('Errore', err.message || 'Impossibile eliminare la recensione');
      },
    });
  };

  // Gestione modifica recensione

  return (
    <View style={styles.screen}>
      <ProfileTopBar
        onLogout={handleLogout}
        onEdit={() => setEditModalVisible(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          displayName={displayName}
          email={user.email ?? ''}
          avatar={photoURL}
          memberSince={memberSince}
          favorites={favoriteTrails?.length ?? 0}
          reviews={userReviews?.length ?? 0}
          onEdit={() => setEditModalVisible(true)}
        />

        <ProfileTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === 'archive' ? (
          <ProfileArchive
            loading={isLoadingFavorites}
            trails={favoriteTrails ?? []}
            favoriteIds={favoriteIds}
            onPressTrail={handleOpenTrail}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <ProfileReviews
            loading={isLoadingReviews}
            reviews={userReviews as any}
          
            onDeleteReview={handleDeleteReview}
          />
        )}
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        currentName={displayName}
        currentAvatarUrl={photoURL}
        onClose={() => setEditModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});