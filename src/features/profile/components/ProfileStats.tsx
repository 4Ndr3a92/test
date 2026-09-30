import { colors, spacing, radius, typography } from "@/shared/theme";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  favorites: number;
  reviews: number;
};

export const ProfileStats = ({
  favorites,
  reviews,
}: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{favorites}</Text>
        <Text style={styles.statLabel}>
          {t("profile.favorites")}
        </Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{reviews}</Text>
        <Text style={styles.statLabel}>
          {t("profile.reviews")}
        </Text>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xxl,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },


});