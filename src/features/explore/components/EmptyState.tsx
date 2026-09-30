import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from "@/shared/theme";
export const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Ionicons name="trail-sign-outline" size={48} color={colors.textMuted} />
      <Text style={styles.title}>{t('explore.emptyTitle')}</Text>
      <Text style={styles.subtitle}>{t('explore.emptySubtitle')}</Text>
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>{t('explore.resetFilters')}</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxl * 2, paddingHorizontal: spacing.xl },
  title: { ...typography.sectionTitle, color: colors.textPrimary, marginTop: spacing.lg },
  subtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 19 },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  buttonText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
});