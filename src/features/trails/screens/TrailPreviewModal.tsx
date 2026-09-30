import React, { useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { spacing, colors, radius, typography } from '@/shared/theme';

import { useTrailDetail } from '../hooks/useTrailDetail';
import { useTrailImages } from '../hooks/useTrailImages';
import { Badge } from '@/shared/components/badge';
import { useMapStore } from '@/features/map/store/mapStore';
import { router } from 'expo-router';
import { useStartTrail } from '@/features/tracking/hooks/useStartTrail';


const { width } = Dimensions.get('window');
const THUMB_WIDTH = (width - spacing.lg * 2 - spacing.sm) / 2;

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';

interface Props {


}

export const TrailPreviewModal: React.FC<Props> = ({ }) => {
  const { t } = useTranslation();
   // Zustand Global Store
   const startNav = useMapStore((s) => s.startNav);
   const setNoneState = useMapStore((s) => s.setNoneState);
   const trailId = useMapStore((s) => s.selectedTrailId);
   const startTrail = useStartTrail(); 


  const { data: trail } = useTrailDetail(trailId ?? '');
  const { data: trailImages = [] } = useTrailImages(trailId);

  // Immagini da mostrare: Storage o POI come fallback
  const images = trailImages.map((img) => img.url)
  const handleStartNavigation = () => {
    if (trailId) {
      startNav(trailId);
      
      // Sostituisce il formSheet dei dettagli con quello del tracking attivo.
      // Se l'utente fa il back dal tracking, tornerà direttamente sulla mappa.
      startTrail(trailId)
      router.back()

    }
  };
  useEffect(() => {
    return () => {
      router.dismissTo('/(tabs)/map')
   
      setNoneState();
      
    };
  }, [setNoneState]);
  return (
    
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {trail && <Badge difficulty={trail.difficulty} />}
              <Text style={styles.trailName} numberOfLines={2}>
                {trail?.name ?? ''}
              </Text>
            </View>

          </View>

          {/* Location */}
          {trail && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.locationText}>{trail.location}</Text>
            </View>
          )}

          {/* Stats rapide */}
          {trail && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="walk-outline" size={16} color={colors.primary} />
                <Text style={styles.statValue}>{trail.stats.distanceKm} km</Text>
                <Text style={styles.statLabel}>{t('trailDetail.distance')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={styles.statValue}>{trail.stats.durationLabel}</Text>
                <Text style={styles.statLabel}>{t('trailDetail.duration')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="trending-up-outline" size={16} color={colors.primary} />
                <Text style={styles.statValue}>+{trail.stats.elevationGainM} m</Text>
                <Text style={styles.statLabel}>{t('trailDetail.elevationGain')}</Text>
              </View>
            </View>
          )}

          {/* Griglia foto */}
   

          {/* CTA — Inizia il percorso */}
          <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation}>
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>{t('map.startTrail')}</Text>
          </TouchableOpacity>
        </View>
      </View>

  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, 
            backgroundColor: colors.border,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
  },
  sheet: {

    backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: spacing.lg,
    
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  headerLeft: { flex: 1, gap: spacing.sm },
  trailName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  closeBtn: { marginLeft: spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md },
  locationText: { fontSize: 13, color: colors.textSecondary },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.background,
    borderRadius: radius.lg, paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textMuted },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border },
  photosScroll: { marginBottom: spacing.md },
  photosRow: { gap: spacing.sm, paddingRight: spacing.lg },
  photo: { height: 120, borderRadius: radius.md },
  startButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.primary,
    borderRadius: radius.lg, paddingVertical: spacing.lg,
  },
  startButtonText: { ...typography.buttonText },
});