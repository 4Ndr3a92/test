import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { HeroHeader } from '../components/HeroHeader';
import WeatherWidget from '../components/WeatherWidget';
import { TrailGrid } from '@/shared/components/TrailGrid';
import { useHomeTrails } from '../hooks/useHomeTrails';
import { CategoryCard } from '../components/CategoryCard';
import { useMapStore } from '@/features/map/store/mapStore';
import { useToggleHomeFavorite } from '../hooks/useToggleHomeFavorite';
import { useFavoriteIds } from '../hooks/useFavoriteIds';

interface CategoryItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  image: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
}

const categories: CategoryItem[] = [
  {
    id: '1',
    titleKey: 'home.categories.excursions.title',
    subtitleKey: 'home.categories.excursions.subtitle',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=300&q=80',
    iconName: 'walk',
    iconBg: '#4CAF50',
  },
  {
    id: '2',
    titleKey: 'home.categories.gorges.title',
    subtitleKey: 'home.categories.gorges.subtitle',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80',
    iconName: 'water',
    iconBg: '#2196F3',
  },
  {
    id: '3',
    titleKey: 'home.categories.relax.title',
    subtitleKey: 'home.categories.relax.subtitle',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80',
    iconName: 'umbrella',
    iconBg: '#FFC107',
  },
  {
    id: '4',
    titleKey: 'home.categories.panoramas.title',
    subtitleKey: 'home.categories.panoramas.subtitle',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    iconName: 'camera',
    iconBg: '#FF5722',
  },
];

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { urbano, principale } = useHomeTrails();
  const toggleFavoriteMutation = useToggleHomeFavorite();
  const { data: favoriteIds = [] } = useFavoriteIds();

  const handleCategoryPress = (categoryItem: CategoryItem) => {
    router.push({
      pathname: '/(tabs)/explore', 
      params: { category: categoryItem.id },
    });
  };

  const handleToggleFavorite = (trailId: string) => {
    const currentlyFavorite = favoriteIds.includes(trailId);
    toggleFavoriteMutation.mutate({
      trailId,
      isFavorite: currentlyFavorite,
    });
  };

  const handleTrailPress = (id: string) => {
    router.push({
      pathname: '/trails/[id]',
      params: { id }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <HeroHeader title={t('home.heroTitle')} />
        <WeatherWidget />

        {/* Sezione Griglia dei Percorsi principale */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.sections.adventures')}</Text>
        </View>

        <TrailGrid 
          horizontal={true}
          trails={principale}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onPressTrail={handleTrailPress}
          width={0.7}
          horizontalPadding={5}
        />
        
        {/* Sezione Griglia dei Percorsi urbani */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.sections.urban')}</Text>
        </View>

        <TrailGrid 
          horizontal={true}
          trails={urbano}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onPressTrail={handleTrailPress}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.sections.experience')}</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.cardsScroll}
        >
          {categories.map((item) => (
            <CategoryCard 
              key={item.id}
              title={t(item.titleKey)}
              subtitle={t(item.subtitleKey)}
              imageUri={item.image}
              iconName={item.iconName}
              iconBg={item.iconBg}
              onPress={() => handleCategoryPress(item)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  cardsScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 28,
  },
});