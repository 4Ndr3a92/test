import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors } from '@/shared/theme';
import { ImageSlider, SlideItem } from '@/shared/components/ImageSlider';
import { TrailImage } from '@/features/trails/api/trailImagesApi';
import { useMapStore } from '@/features/map/store/mapStore';

import { CategoriesSection } from '@/features/trails/components/CategoriesSection';
import { DescriptionSection } from '@/features/trails/components/DescriptionSection';
import { DetailHeader } from '@/features/trails/components/DetailHeader';
import { MapButton } from '@/features/trails/components/MapButton';
import { PointsOfInterestSection } from '@/features/trails/components/PointsOfInterestSection';
import { ReviewsSection } from '@/features/trails/components/ReviewsSection';
import { StatsGrid } from '@/features/trails/components/StatsGrid';
import { useIsFavorite } from '@/features/trails/hooks/useIsFavorite';
import { useTrailDetail } from '@/features/trails/hooks/useTrailDetail';
import { useTrailImages } from '@/features/trails/hooks/useTrailImages';
import { useToggleFavorite } from '@/features/trails/hooks/useToggleFavorite';

interface Props {
  trailId: string;
}

const buildSlides = (trailImages: TrailImage[]): SlideItem[] => {
  return trailImages.map((img) => ({ id: img.name, url: img.url }));
};

export const TrailDetailModal: React.FC<Props> = ({ trailId }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const openTrail = useMapStore((s) => s.openTrail);

  const { data: trail, isLoading, isError } = useTrailDetail(trailId);
  const { data: trailImages = [] } = useTrailImages(trailId);
  const { data: isFavorite = false } = useIsFavorite(trailId);
  
  // Passiamo il valore corrente di isFavorite
  const favoriteMutation = useToggleFavorite(trailId, isFavorite);

  const slides = buildSlides(trailImages);

  const handleStartNavigation = () => {
    router.dismissAll();
    openTrail(trailId);
    router.push({
      pathname: '/(tabs)/map',
      params: { autoFitTrailId: trailId },
    }); 
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{t('trailDetail.errorLoading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {trail && (
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <ImageSlider
            slides={slides}
            height={400}
            topInset={Platform.OS === 'ios' ? 0 : insets.top}
            actions={[
              {
                position: 'left',
                icon: 'chevron-back',
                onPress: () => router.back(),
              },
              {
                position: 'right',
                icon: 'heart-outline',
                activeIcon: 'heart',
                isActive: isFavorite,
                activeColor: '#E53935',
                onPress: () => favoriteMutation.mutate(),
              },
            ]}
          />
          
          <DetailHeader
            name={trail.name}
            difficulty={trail.difficulty}
            location={trail.location}
          />
          
          <StatsGrid stats={trail.stats} />
          
          <MapButton handlePress={handleStartNavigation} />
          
          <DescriptionSection description_long={trail.description_long} />
          
          {trail.pointsOfInterest && (
            <PointsOfInterestSection points={trail.pointsOfInterest} />
          )}
          
          <CategoriesSection categories={trail.categories} />
          
          <ReviewsSection
            trailId={trail.id}
            ratingAverage={trail.ratingAverage}
            ratingCount={trail.ratingCount}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: { 
    backgroundColor: colors.background,
    paddingBottom: 60, 
    flexGrow: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.background,
  },
  errorText: { 
    color: colors.danger, 
    fontSize: 14, 
  },
});