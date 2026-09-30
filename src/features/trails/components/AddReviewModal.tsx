import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StarRating } from './StarRating';
import { colors, spacing, radius, typography } from '../../../shared/theme';

interface Props {
  visible: boolean;
  isSubmitting: boolean;
  initialRating?: number;
  initialComment?: string;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const AddReviewModal: React.FC<Props> = ({
  visible,
  isSubmitting,
  initialRating = 0,
  initialComment = '',
  mode,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (visible) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [visible, initialRating, initialComment]);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={typography.sectionTitle}>
              {mode === 'edit'
                ? t('trailDetail.reviews.modalTitleEdit')
                : t('trailDetail.reviews.modalTitleCreate')}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Contenuto Scorrevole */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.starsWrap}>
              <StarRating
                rating={rating}
                size={36}
                interactive
                onChange={setRating}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder={t('trailDetail.reviews.commentPlaceholder')}
              placeholderTextColor={colors.textMuted}
              multiline
              value={comment}
              onChangeText={setComment}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                (rating === 0 || isSubmitting) && styles.disabled,
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={typography.buttonText}>
                  {mode === 'edit'
                    ? t('trailDetail.reviews.submitEdit')
                    : t('trailDetail.reviews.submit')}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  starsWrap: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 140,
    fontSize: 15,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: spacing.xl,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});