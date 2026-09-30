import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { colors, spacing, radius, typography } from '@/shared/theme';
import { ProfileEmptyState } from './ProfileEmptyState';

export interface ProfileUserReview {
  id: string;
  trail_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  trail?: {
    id: string;
    name: string;
  } | null;
  trails?: {
    id: string;
    name: string;
  } | null;
}

interface ProfileReviewsProps {
  loading: boolean;
  reviews: ProfileUserReview[];
  onDeleteReview?: (reviewId: string) => void;
}

export const ProfileReviews: React.FC<ProfileReviewsProps> = ({
  loading,
  reviews,
  onDeleteReview,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <ProfileEmptyState
        icon="chatbubble-ellipses-outline"
        title={t('profile.noReviewsTitle', 'Nessuna recensione')}
        subtitle={t(
          'profile.noReviewsSubtitle',
          'Non hai ancora lasciato nessuna recensione sui percorsi.'
        )}
        buttonText={t('profile.exploreTrails', 'Esplora i percorsi')}
        onPress={() => router.push('/(tabs)/explore')}
      />
    );
  }

  const handleTrailPress = (id: string) => {
    router.push({
      pathname: '/trails/[id]',
      params: { id },
    });
  };

  const handleDeletePress = (reviewId: string) => {
    Alert.alert(
      t('profile.deleteReviewTitle', 'Elimina recensione'),
      t(
        'profile.deleteReviewConfirm',
        'Sei sicuro di voler eliminare questa recensione?'
      ),
      [
        {
          text: t('common.cancel', 'Annulla'),
          style: 'cancel',
        },
        {
          text: t('common.delete', 'Elimina'),
          style: 'destructive',
          onPress: () => onDeleteReview && onDeleteReview(reviewId),
        },
      ]
    );
  };

  const renderStarsWithRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFB800"
          style={{ marginRight: 2 }}
        />
      );
    }
    return (
      <View style={styles.ratingGroup}>
        <View style={styles.starsContainer}>{stars}</View>
        <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {reviews.map((review) => {
        const trailName =
          review.trail?.name?.trim() ??
          review.trails?.name?.trim() ??
          t('profile.unnamedTrail', 'Percorso sconosciuto');

        return (
          <TouchableOpacity
            key={review.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleTrailPress(review.trail_id)}
          >
            {/* Intestazione: Nome percorso e Tasto Elimina */}
            <View style={styles.cardHeader}>
              <Text style={styles.trailName} numberOfLines={1}>
                {trailName}
              </Text>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation(); // Evita la navigazione al click sull'icona trash
                  handleDeletePress(review.id);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger || '#E53935'}
                />
              </TouchableOpacity>
            </View>

            {/* Stelle + Rating Numerico e Data */}
            <View style={styles.subHeader}>
              {renderStarsWithRating(review.rating)}
              <Text style={styles.dateText}>
                {formatDate(review.created_at)}
              </Text>
            </View>

            {/* Commento */}
            {!!review.comment && (
              <Text style={styles.commentText}>{review.comment}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centerContainer: {
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg || 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  trailName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  actionButton: {
    paddingLeft: spacing.xs,
    marginLeft: spacing.xs,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted || colors.textSecondary,
  },
  commentText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
});