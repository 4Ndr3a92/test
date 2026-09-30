import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, radius } from '@/shared/theme';

import { usePoiDetail } from '../hooks/usePoiDetail';
import { PoiHeaderImage } from '../components/PoiHeaderImage';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PoiDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Recupero dei dati tramite l'Hook React Query
  const { data: poi, isLoading, isError, refetch } = usePoiDetail(id);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !poi) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorText}>Impossibile caricare il punto di interesse.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categories = poi.categories ?? [];
  const categoryStr = categories.join(' ').toLowerCase();

  const isRestPoint = categoryStr.includes('sosta') || categoryStr.includes('picnic') || categoryStr.includes('riposo');
  const isBikePoint = categoryStr.includes('bike') || categoryStr.includes('bici') || categoryStr.includes('ciclismo');
  const isInfoPoint = categoryStr.includes('info') || categoryStr.includes('informazione') || categoryStr.includes('infopoint');

  const isSpecialCategory = isRestPoint || isBikePoint || isInfoPoint;

  const renderCategoryIcon = () => {
    if (isRestPoint) return <FontAwesome6 name="campground" size={64} color={colors.primaryLight} />;
    if (isBikePoint) return <FontAwesome6 name="bicycle" size={64} color={colors.primaryLight} />;
    if (isInfoPoint) return <FontAwesome6 name="circle-info" size={64} color={colors.primaryLight} />;
    return null;
  };

  const imageUrl = poi.imageUrl || poi.thumbnail_url;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Se è una categoria speciale senza immagine, mostra un header con l'icona tematica e il pulsante indietro */}
        {isSpecialCategory && !imageUrl ? (
          <View style={styles.iconHeaderContainer}>
            <SafeAreaView style={styles.backButtonSafeArea} edges={['top']}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </SafeAreaView>
            {renderCategoryIcon()}
          </View>
        ) : (
          <PoiHeaderImage imageUrl={imageUrl} />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{poi.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.locationText}>{poi.location}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Informazioni</Text>
          <Text style={styles.description}>
            {poi.description || 'Nessuna descrizione disponibile per questo punto di interesse.'}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Fisso */}
      <SafeAreaView style={styles.footerSafeArea}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => router.push({ pathname: '/map', params: { poiId: poi.id } })}
            activeOpacity={0.85}
          >
            <Ionicons name="map-outline" size={20} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>Mostra sulla Mappa</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryButtonText: { color: colors.primaryDark, fontWeight: '600' },
  scrollContent: { paddingBottom: 100 },
  iconHeaderContainer: {
    height: 220,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  backButtonSafeArea: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  footerSafeArea: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footer: { padding: spacing.sm },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  mapButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});