import {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, TextInputProps} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors, spacing, radius, typography} from '../theme';


interface Props extends TextInputProps {
    icon: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
    error?: boolean;
}

export const TextField = ({icon, isPassword, error, style, ...rest  }: Props) =>{
      const [secure, setSecure] = useState(true);
      return (
        <View style = {[styles.container, error && styles.containerError]}>
            <Ionicons name = {icon} size={18} color = {error ? colors.danger : colors.primary} />
            <TextInput style = {[typography.inputText, styles.input]} placeholderTextColor={colors.textMuted} secureTextEntry = {isPassword && secure} autoCapitalize='none' {...rest}/> 
            {isPassword && (
                <TouchableOpacity onPress={() => setSecure (v => !v)} hitSlop={8}>
                    <Ionicons 
                        name={secure ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={colors.primary}
                    />

                </TouchableOpacity>
            )}
        </View>
      )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  containerError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  input: { flex: 1, padding: 0 },
});