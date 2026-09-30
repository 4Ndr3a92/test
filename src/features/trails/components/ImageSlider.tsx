import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View, FlatList, TouchableOpacity, Text,
  StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '../../../shared/theme';
import { PointOfInterest } from '@/features/trails/types/trail';
import { TrailImage } from '../api/trailImagesApi';
const { width,height } = Dimensions.get('window');
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';
const AUTOPLAY_INTERVAL_MS = 3000;
const RESUME_AFTER_INTERACTION_MS = 5000;

interface SlideItem {
  id: string;
  url: string;
}

interface Props {
  trailImages: TrailImage[];        // immagini da Storage (fonte primaria)
       // immagini dai POI (fallback)
  isFavorite: boolean;
  topInset: number;
  onBack: () => void;
  onToggleFavorite: () => void;
}

/**
 * Normalizza le due possibili sorgenti in un unico array di SlideItem.
 * Usa Storage se disponibile, altrimenti cade sui POI.
 */
const buildSlides = (trailImages: TrailImage[]): SlideItem[] => {

    return trailImages.map((img) => ({ id: img.name, url: img.url }));

};

export const ImageSlider: React.FC<Props> = ({trailImages, isFavorite,  topInset, onBack, onToggleFavorite, }) => {
  const slides = buildSlides(trailImages);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserInteracting = useRef(false);

  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (slides.length <= 1) return;

    autoplayTimer.current = setInterval(() => {
      if (isUserInteracting.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);
  }, [slides.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [startAutoplay]);

  const handleScrollBeginDrag = () => {
    isUserInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleScrollEndDrag = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleDotPress = (index: number) => {
    isUserInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
    resumeTimer.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  };
  const buttonTop = topInset + spacing.sm;
  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <Image
            source={item.url}
            style={styles.image}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={150}
            cachePolicy="disk"
          />
        )}
      />

      <TouchableOpacity style={[styles.iconButton, styles.backButton, { top: buttonTop+ 40 }, ]} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.iconButton, styles.favButton, { top: buttonTop + 40 }, ]} onPress={onToggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? '#E53935' : '#FFFFFF'}
        />
      </TouchableOpacity>

      {slides.length > 1 && (
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => handleDotPress(i)} hitSlop={8}>
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: height * 0.35 },
  image: { width, height: height * 0.35 },
  iconButton: {
    position: 'absolute', top: 40, width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  backButton: { left: spacing.lg },
  favButton: { right: spacing.lg },
  dotsRow: {
    position: 'absolute', bottom: spacing.xl, width: '100%',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 20, backgroundColor: '#FFFFFF' },
});