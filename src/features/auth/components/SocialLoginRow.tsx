import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { SocialButton } from '../../../shared/components/SocialButton';
import { spacing, colors } from '@/shared/theme'

interface Props {
  onGoogle: () => void;
 // onFacebook: () => void;
 // onTwitter: () => void;
  onApple: () => void;
}

export const SocialLoginRow: React.FC<Props> = ({ onGoogle,onApple }) => {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.row}>
        <SocialButton label={t('auth.google')} iconName="logo-google" iconColor="#EA4335" onPress={onGoogle} />
        <SocialButton
          label={t('auth.apple')}
          iconName="logo-apple"
          iconColor="#000000"
          caption={Platform.OS !== 'ios' ? t('auth.iosOnly') : undefined}
          onPress={onApple}
          disabled={Platform.OS !== 'ios'}
        />

      </View>
      <View style={styles.row}>
       { /*<SocialButton label={t('auth.twitter')} iconName="logo-twitter" iconColor="#000000" onPress={onTwitter}  /> */}
       {   /*    <SocialButton label={t('auth.facebook')} iconName="logo-facebook" iconColor="#1877F2" onPress={onFacebook} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 12, color: colors.textSecondary },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
});