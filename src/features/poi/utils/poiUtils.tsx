import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '@/shared/theme';

export interface PoiMarkerConfig {
  imageUrl?: string;
  icon?: React.ReactNode;
}

export const getPoiMarkerConfig = (poi: {
  categories?: string[];
  image_url?: string;
  imageUrl?: string;
}): PoiMarkerConfig => {
  const categoriesList = poi.categories ?? [];
  const categories = categoriesList.map((c) => c.toLowerCase());

  const rawImageUrl = poi.image_url || poi.imageUrl;

  // 1. Punto Sosta
  if (categories.some((c) => c.includes('sosta') || c.includes('picnic') || c.includes('riposo'))) {
    return {
      icon: <FontAwesome6 name="campground" size={16} color={colors.primaryLight} />,
    };
  }

  // 2. Punto Bike
  if (categories.some((c) => c.includes('bike') || c.includes('bici') || c.includes('ciclismo'))) {
    return {
      icon: <FontAwesome6 name="bicycle" size={16} color={colors.primaryLight} />,
    };
  }

  // 3. Punto Informazione
  if (categories.some((c) => c.includes('info') || c.includes('informazione') || c.includes('infopoint'))) {
    return {
      icon: <FontAwesome6 name="circle-info" size={16} color={colors.primaryLight} />,
    };
  }

  // Se non appartiene a nessuna delle categorie speciali, usa l'immagine (se presente)
  return {
    imageUrl: rawImageUrl,
    icon: !rawImageUrl ? (
      <FontAwesome6 name="location-dot" size={16} color={colors.primaryLight} />
    ) : undefined,
  };
};