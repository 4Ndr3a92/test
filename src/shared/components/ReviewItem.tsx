import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../features/auth/store/authStore';
import { colors, radius, spacing } from '../theme';


export interface ReviewItemData {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: number;
}

interface Props {
  review: ReviewItemData;
  onEdit?: (review: ReviewItemData) => void;
  onDelete?: (review: ReviewItemData) => void;
  showTrailName?: boolean;
  trailName?: string;
  onPressTrailName?: () => void;
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 13 }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3, 4, 5].map((value) => (
      <Ionicons
        key={value}
        name={value <= Math.round(rating) ? 'star' : 'star-outline'}
        size={size}
        color={value <= Math.round(rating) ? '#F5A623' : '#D9D9D9'}
      />
    ))}
  </View>
);

export const ReviewItem: React.FC<Props> = ({
  review,
  onEdit,
  onDelete,
  showTrailName = false,
  trailName,
  onPressTrailName,
}) => {
  const { t } = useTranslation();
  const user  = useAuthStore((s) => s.user);
  const isOwn = user?.id === review.userId;

  return (
    <View style={styles.container}>
      {/* Nome percorso — opzionale, mostrato nel profilo */}
      {showTrailName && trailName && (
        <TouchableOpacity onPress={onPressTrailName} disabled={!onPressTrailName}>
          <Text style={styles.trailName}>{trailName}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatar}>
          {review.userAvatarUrl ? (
            <Image source={{ uri: review.userAvatarUrl }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarInitial}>
              {review.userName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        {/* Contenuto */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>

          <StarRating rating={review.rating} />

          <Text style={styles.comment}>{review.comment}</Text>

          {/* Azioni — visibili solo sull'utente proprietario */}
          {isOwn && (onEdit || onDelete) && (
            <View style={styles.actionsRow}>
              {onEdit && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEdit(review)}
                  hitSlop={8}
                >
                  <Ionicons name="create-outline" size={14} color={colors.primary} />
                  <Text style={styles.editText}>{t('trailDetail.reviews.edit')}</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onDelete(review)}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={14} color={colors.danger} />
                  <Text style={styles.deleteText}>{t('trailDetail.reviews.delete')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trailName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { color: '#FFFFFF', fontWeight: '700' },
  content: { flex: 1, gap: 4 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  date: { fontSize: 12, color: colors.textMuted },
  starsRow: { flexDirection: 'row', gap: 2 },
  comment: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: spacing.lg, marginTop: 6 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  deleteText: { fontSize: 12, color: colors.danger, fontWeight: '700' },
});