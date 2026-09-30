import { CardTrail } from '@/features/home/api/homeApi';
import { FeaturedCard } from '@/shared/components/FeaturedCard';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { spacing } from '../theme';


interface Props {
  trails: CardTrail[];
  onPressTrail: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  horizontal: boolean;
  favoriteIds?: string[];
  horizontalPadding?: number;
  width?: number;
}

export const TrailGrid: React.FC<Props> = ({
  trails,
  onPressTrail,
  onToggleFavorite,
  horizontal,
  favoriteIds = [],
  horizontalPadding = spacing.lg,
  width = 0.7
}) => (
  <ScrollView 
    horizontal ={horizontal}
    showsVerticalScrollIndicator = {false}
    showsHorizontalScrollIndicator= {false} 
    style={[styles.grid, { paddingHorizontal: horizontalPadding }]}>
    {trails.map((trail) => (
      <View key={trail.id} style={styles.cardWrap}>
        <FeaturedCard
          trail={trail}
          onPress={() => onPressTrail(trail.id)}
          onToggleFavorite={() => onToggleFavorite(trail.id)}
          isFavorite={favoriteIds.includes(trail.id)}
          horizontalWidth={width}
        />
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  grid: {

    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
    cardWrap: {
    
  },
});