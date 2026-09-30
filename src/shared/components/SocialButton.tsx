import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {colors, spacing, radius, typography} from '../theme';

interface Props {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  caption?: string;
  onPress: () => void;
  disabled?: boolean;
}


export const SocialButton = ({label, iconName, iconColor, caption, onPress, disabled,}: Props) => (
    <TouchableOpacity 
        style = {[styles.button, disabled && styles.disabled]}
        onPress={onPress}
        disabled = {disabled}
        activeOpacity={0.7} 
    >
        
        
        <Ionicons name = {iconName} size = {18} color={iconColor}/>
        <Text  style = {typography.socialText}>{label}</Text>
        {caption && (
            <View style = {styles.captionPill}>
                <Text style = {styles.captionText}>{caption}</Text>
            </View>
        )}
    </TouchableOpacity>
)



const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  disabled: { opacity: 0.5 },
  captionPill: { marginLeft: 2 },
  captionText: { fontSize: 10, color: colors.primary, fontWeight: '600' },
});