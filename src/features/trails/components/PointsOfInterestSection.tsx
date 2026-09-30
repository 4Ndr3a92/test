import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, typography } from '../../../shared/theme';
import { PointOfInterest } from '../types/trail';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';

interface Props {
  points: PointOfInterest[];
}

export const PointsOfInterestSection: React.FC<Props> = ({ points }) => {
  const { t } = useTranslation();

  const handlePoiPress = (poiId: string) => {
    router.push({
      pathname: '/pois/[id]',
      params: { id: poiId },
    });
  };

  return (
    <View style={styles.card}>
      <Text style={[typography.sectionTitle, styles.title]}>{t('trailDetail.pointsOfInterest')}</Text>
      {points.map((p, i) => {
        const categoriesList = p.categories ?? p.categories ?? [];
        const categories = categoriesList.map((c) => c.toLowerCase());

        const isRestPoint = categories.some((c) => c.includes('sosta') || c.includes('picnic') || c.includes('riposo'));
        const isBikePoint = categories.some((c) => c.includes('bike') || c.includes('bici') || c.includes('ciclismo'));
        const isInfoPoint = categories.some((c) => c.includes('info') || c.includes('informazione') || c.includes('infopoint'));

        const isSpecialPoi = isRestPoint || isBikePoint || isInfoPoint;
        const imageUrl = p.image_url;

        const renderPoiIcon = () => {
          if (isRestPoint) return <FontAwesome6 name="campground" size={28} color={colors.primary} />;
          if (isBikePoint) return <FontAwesome6 name="bicycle" size={28} color={colors.primary} />;
          if (isInfoPoint) return <FontAwesome6 name="circle-info" size={28} color={colors.primary} />;
          return <FontAwesome6 name="location-dot" size={28} color={colors.primary} />;
        };

        return (
          <TouchableOpacity
            key={p.id}
            style={[styles.row, i === points.length - 1 && styles.rowLast]}
            activeOpacity={0.7}
            onPress={() => handlePoiPress(p.id)}
          >
            {isSpecialPoi || !imageUrl ? (
              <View style={styles.iconImageFallback}>
                {renderPoiIcon()}
              </View>
            ) : (
              <Image
                style={styles.image}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={150}
                cachePolicy="disk"
                source={imageUrl}
              />
            )}

            <View style={styles.textWrap}>
              <Text style={styles.poiTitle}>{p.name}</Text>
              <Text style={styles.poiDesc} numberOfLines={3}>{p.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  title: { color: colors.textPrimary, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
  image: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
  },
  iconImageFallback: {
    width: 80,
    height: 80,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  textWrap: { flex: 1 },
  poiTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  poiDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  chevron: { marginLeft: spacing.xs },
});