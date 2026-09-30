import { View, Text, ImageBackground, StyleSheet, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography} from '@/shared/theme';

export const AuthHero = () => {
    const {t}  = useTranslation();
    return (
        <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
        >
        <View style={styles.content}>
            <View style={styles.logoCircle}>
            <Ionicons name="water" size={48} color={colors.primary} />
            </View>
            <Text style={typography.appName}>{t('auth.appName')}</Text>
            <Text style={typography.tagline}>{t('auth.tagline')}</Text>
        </View>
        </ImageBackground>
    );

}


const styles = StyleSheet.create({
  hero: {
    height: 360,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heroImage: { resizeMode: 'cover', opacity: 0.5 },
  content: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(45,106,45,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
});