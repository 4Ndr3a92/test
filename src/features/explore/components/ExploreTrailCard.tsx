import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/shared/theme';
import { ExploreItem } from '../types/exploreFilters';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';

interface Props {
  item: ExploreItem;
  onPress: () => void;
}

const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} h${m > 0 ? ` ${m}` : ''}` : `${m} min`;
};

export const ExploreTrailCard: React.FC<Props> = ({ item, onPress }) => {
  const isRoute = item.type === 'route';

  // Gestione Icona Categoria Speciale POI (Sosta, Bike, Info)
  const categoriesList = item.categories ?? [];
  const categories = categoriesList.map((c) => c.toLowerCase());

  const isRestPoint = categories.some((c) => c.includes('sosta') || c.includes('picnic') || c.includes('riposo'));
  const isBikePoint = categories.some((c) => c.includes('bike') || c.includes('bici') || c.includes('ciclismo'));
  const isInfoPoint = categories.some((c) => c.includes('info') || c.includes('informazione') || c.includes('infopoint'));

  const isSpecialPoi = !isRoute && (isRestPoint || isBikePoint || isInfoPoint);
  const imageUrl = item.thumbnail_url || item.imageUrl;

  const renderPoiIcon = () => {
    if (isRestPoint) return <FontAwesome6 name="campground" size={28} color={colors.primary} />;
    if (isBikePoint) return <FontAwesome6 name="bicycle" size={28} color={colors.primary} />;
    if (isInfoPoint) return <FontAwesome6 name="circle-info" size={28} color={colors.primary} />;
    return <FontAwesome6 name="person-hiking" size={28} color={colors.primary} />;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {isSpecialPoi || !imageUrl ? (
        <View style={styles.iconImageFallback}>
          {renderPoiIcon()}
        </View>
      ) : (
        <Image
          source={imageUrl}
          style={styles.image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={150}
          cachePolicy="disk"
        />
      )}

      <View style={styles.content}>
        <Text style={[typography.cardTitle, styles.name]} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          <Ionicons name="location" size={11} color={colors.textSecondary} /> {item.location}
        </Text>

        {isRoute ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="walk-outline" size={13} color={colors.textMuted} />
              <Text style={styles.statText}>{item.distanceKm} km</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={13} color={colors.textMuted} />
              <Text style={styles.statText}>{formatDuration(item.durationMin)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up-outline" size={13} color={colors.textMuted} />
              <Text style={styles.statText}>+{item.elevationGainM} m</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.poiDescription} numberOfLines={1}>
            {item.description || 'Punto di interesse'}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    padding: spacing.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 90, height: 100, borderRadius: radius.xl },
  iconImageFallback: {
    width: 90,
    height: 100,
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: { flex: 1, padding: spacing.md, gap: 4 },
  name: { color: colors.textPrimary, marginTop: 2 },
  location: { fontSize: 12, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: 4 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  poiDescription: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});