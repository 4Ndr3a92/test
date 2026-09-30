import { colors, spacing } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity,StyleSheet } from "react-native";

type Props = {
  onLogout: () => void;
  onEdit: () => void;
};

export const ProfileTopBar = ({
  onLogout,
  onEdit,
}: Props) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={onLogout} hitSlop={8}>
      <Ionicons
        name="log-out-outline"
        size={22}
        color={colors.danger}
      />
    </TouchableOpacity>

    <TouchableOpacity onPress={onEdit} hitSlop={8}>
      <Ionicons
        name="create-outline"
        size={22}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  
});