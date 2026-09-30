import { Badge } from '@/shared/components/badge';
import { radius, spacing, typography } from '@/shared/theme';
import { colors } from '@/shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardTrail } from '../../features/home/api/homeApi';
const { width } = Dimensions.get('window');


interface Props {
  trail: CardTrail;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite?: boolean;
  horizontalWidth: number;
}

const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} h${m > 0 ? ` ${m}` : ''}` : `${m} min`;
};

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';

export const FeaturedCard: React.FC<Props> = ({
  trail,
  onPress,
  onToggleFavorite,
  isFavorite = false,
  horizontalWidth,
}) => {
  // Handler separato e sincrono — nessun accesso all'evento
  const handleFavPress = () => {
    onToggleFavorite();
  };

  const handleCardPress = () => {
    onPress();
  };


  return (
    <TouchableOpacity style={[styles.card,{width: horizontalWidth * width}]} onPress={handleCardPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={trail.thumbnail_url || trail.imageUrl}
          style={StyleSheet.absoluteFill}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={200}
          cachePolicy="disk"
        />
        <View style={styles.imageRow}>
          <Badge difficulty={trail.difficulty} />
          <TouchableOpacity
            onPress={handleFavPress}
            style={styles.favBtn}
            hitSlop={8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite ? '#E53935' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="walk-outline" size={11} color="#FFFFFF" />
            <Text style={styles.stat}>{trail.distanceKm} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={11} color="#FFFFFF" />
            <Text style={styles.stat}>{formatDuration(trail.durationMin)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.info}>
        <Text
          style={[typography.cardTitle, {flexWrap: "wrap", color: colors.textPrimary }]}
          numberOfLines={0}
        >
          {trail.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={11} color={colors.textMuted} />
          <Text
            style={[typography.caption, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {trail.location}
          </Text>
        </View>
        <Text
          style={[typography.caption, { color: colors.textMuted }]}
          numberOfLines={3}
        >
          {trail.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {

    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F2F7',
    // Ombreggiatura per iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    // Ombreggiatura per Android
    elevation: 2,
  },
  imageContainer: {
    height: 150,
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(145, 144, 144, 0.35)',
    borderRadius: radius.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  stat: { color: '#FFF', fontSize: 11, fontWeight: '500' },
  info: { padding: spacing.md, gap: 3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});