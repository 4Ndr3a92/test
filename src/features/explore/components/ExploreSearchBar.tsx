import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius }  from '@/shared/theme';
import { useTranslation } from 'react-i18next';
interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  activeFilterCount: number;
}

export const ExploreSearchBar: React.FC<Props> = ({ value, onChangeText, onFilterPress, activeFilterCount }) =>{
    const { t } = useTranslation();
    return (
    <View style={styles.row}>
        <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
            style={styles.input}
            placeholder={t('explore.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={onChangeText}
        />
        {value.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
        )}
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={20} color={colors.primary} />
        {activeFilterCount > 0 && (
            <View style={styles.badge}>
            <View style={styles.badgeDot} />
            </View>
        )}
        </TouchableOpacity>
    </View>

    );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: { flex: 1, fontSize: 14, color: colors.textPrimary },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,

  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});