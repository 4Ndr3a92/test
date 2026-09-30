import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ReviewsSummary } from './ReviewsSummary';

import { AddReviewModal } from './AddReviewModal';
import { useTrailReviews } from '../hooks/useTrailReviews';
import { useUserReview } from '../hooks/useUserReview';
import { useSubmitReview } from '../hooks/useSubmitReview';
import { useUpdateReview } from '../hooks/useUpdateReview';
import { useDeleteReview } from '../hooks/useDeleteReview';
import { useAuthStore } from '../../auth/store/authStore';
import { Review } from '../types/trail';
import { colors, spacing, radius, typography } from '../../../shared/theme';
import { ReviewItem } from '@/shared/components/ReviewItem';

interface Props {
  trailId: string;
  ratingAverage: number;
  ratingCount: number;
  
}

export const ReviewsSection: React.FC<Props> = ({ trailId, ratingAverage, ratingCount }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const user = useAuthStore((s) => s.user);

  const { data: reviews, isLoading, isError } = useTrailReviews(trailId);
  const { data: userReview } = useUserReview(trailId);
  const submitMutation = useSubmitReview(trailId);
  const updateMutation = useUpdateReview(trailId);
  const deleteMutation = useDeleteReview(trailId);

  const requireAuth = (action: () => void) => {
    if (!user) {
      Alert.alert(
        t('trailDetail.reviews.authRequiredTitle'),
        t('trailDetail.reviews.authRequiredMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('trailDetail.reviews.goToLogin'), onPress: () => router.push('/profile') },
        ]
      );
      return;
    }
    action();
  };

  const handleWritePress = () => requireAuth(() => {
    // Se l'utente ha già una recensione, "Scrivi" diventa "Modifica" sulla propria.
    if (userReview) {
      setEditingReview(userReview);
    } else {
      setEditingReview(null);
    }
    setModalVisible(true);
  });

  const openEditModal = (review: Review) => requireAuth(() => {
    setEditingReview(review);
    setModalVisible(true);
  });

  const handleDeletePress = (review: Review) => requireAuth(() => {
    Alert.alert(
      t('trailDetail.reviews.deleteConfirmTitle'),
      t('trailDetail.reviews.deleteConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteMutation.mutate({ trailId, reviewId: review.id }),
        },
      ]
    );
  });

  const handleSubmit = (rating: number, comment: string) => {
   
    if (editingReview) {
      updateMutation.mutate(
        { trailId, reviewId: editingReview.id, rating, comment },
        { onSuccess: () => setModalVisible(false) }
      );
    } else {

      submitMutation.mutate(
        { trailId, rating, comment },
        {
          onSuccess: () => setModalVisible(false),
          onError: (err) => {
           
            if (err instanceof Error && err.message === 'ALREADY_REVIEWED') {
              Alert.alert('', t('trailDetail.reviews.alreadyReviewed'));
              setModalVisible(false);
            }
          },
        }
      );
    }
  };

  const isSubmitting = submitMutation.isPending || updateMutation.isPending;
  const hasOwnReview = !!userReview;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[typography.sectionTitle, { color: colors.textPrimary }]}>
          {t('trailDetail.reviews.title')}
        </Text>
        {!hasOwnReview && (
          <TouchableOpacity style={styles.addButton} onPress={handleWritePress}>
            <Ionicons name="add" size={16} color={colors.primary} />
            <Text style={styles.addText}>{t('trailDetail.reviews.write')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ReviewsSummary average={ratingAverage} count={ratingCount} />

      {isLoading && <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />}

      {isError && (
        <Text style={styles.errorText}>{t('trailDetail.reviews.errorLoading')}</Text>
      )}

      {!isLoading && reviews?.length === 0 && (
        <Text style={styles.emptyText}>{t('trailDetail.reviews.empty')}</Text>
      )}

      {reviews?.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onEdit={openEditModal}
          onDelete={handleDeletePress}
        />
      ))}

      <AddReviewModal
        visible={modalVisible}
        isSubmitting={isSubmitting}
        mode={editingReview ? 'edit' : 'create'}
        initialRating={editingReview?.rating}
        initialComment={editingReview?.comment}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  addText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  errorText: { color: colors.danger, fontSize: 13, textAlign: 'center', marginVertical: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginVertical: spacing.md },
});