import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/shared/theme";

interface Props {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    danger?: boolean;
    rightElement?: React.ReactNode;
}


export const ProfileMenuItem = ({icon, label, onPress, danger, rightElement}: Props) => (
    <TouchableOpacity style = {styles.item} onPress = {onPress} activeOpacity = {0.7}>
        <Ionicons  name = {icon} size = {20} color = {danger ? colors.danger : colors.primary} />
        <Text>{label}</Text>
        {rightElement ?? <Ionicons name = 'chevron-forward' size={18} color={colors.textMuted} />}
    </TouchableOpacity>
)


const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  label: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  labelDanger: { color: colors.danger },
});