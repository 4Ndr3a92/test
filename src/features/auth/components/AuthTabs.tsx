import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {useTranslation} from 'react-i18next';
import {colors, spacing, radius, typography } from "@/shared/theme";

type Mode = 'login' | 'register';

interface Props {
    mode: Mode;
    onChange: (mode: Mode)  => void;
}

export const AuthTabs = ({mode, onChange}: Props) => {
    const {t} = useTranslation();
    
    return(
        <View style = {styles.container}>
            <TouchableOpacity
                style = {[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => onChange('login')} 
            >
            <Text style={[typography.tabLabel, { color: mode === 'login' ? colors.primary : colors.textMuted }]}>
                {t('auth.login')}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, mode === 'register' && styles.tabActive]}
                onPress={() => onChange('register')}
            >
            <Text style={[typography.tabLabel, { color: mode === 'register' ? colors.primary : colors.textMuted }]}>
                {t('auth.register')}
            </Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});