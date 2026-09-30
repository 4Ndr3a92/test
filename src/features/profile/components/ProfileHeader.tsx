import { colors, radius, spacing, typography } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Image, Text,StyleSheet } from "react-native";
import { ProfileStats } from "./ProfileStats";

type Props = {
  displayName: string;
  email: string;
  avatar?: string;
  memberSince?: string;
  favorites: number;
  reviews: number;
  onEdit: () => void;
};

export const ProfileHeader = ({
  displayName,
  email,
  avatar,
  memberSince,
  favorites,
  reviews,
  onEdit,
}: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={onEdit}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.avatarEditBadge}>
          <Ionicons
            name="camera"
            size={12}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.displayName}>{displayName}</Text>
      <Text style={styles.email}>{email}</Text>

      {!!memberSince && (
        <View style={styles.memberRow}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={colors.textMuted}
          />
          <Text style={styles.memberSince}>
            {t("profile.memberSince", { date: memberSince })}
          </Text>
        </View>
      )}

      <ProfileStats
        favorites={favorites}
        reviews={reviews}
      />
    </View>
  );
};



const styles = StyleSheet.create({

  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarFallback: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  displayName: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 2 },
  email: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg },
  memberSince: { fontSize: 12, color: colors.textMuted },


});