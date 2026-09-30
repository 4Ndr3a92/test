import React from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RangeFilterRow } from './RangeFilterRow';
import { ExploreFilters, FILTER_BOUNDS, SortOption } from '../types/exploreFilters';
import { colors, typography, spacing, radius } from '@/shared/theme';
import { Difficulty } from '@/shared/type/trail';


// ─── Costanti ──────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: 'recommended',  labelKey: 'explore.sort.recommended'  },
  { value: 'distanceAsc',  labelKey: 'explore.sort.distanceAsc'  },
  { value: 'distanceDesc', labelKey: 'explore.sort.distanceDesc' },
  { value: 'durationAsc',  labelKey: 'explore.sort.durationAsc'  },
  { value: 'ratingDesc',   labelKey: 'explore.sort.ratingDesc'   },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; color: string }[] = [
  { value: 'Facile',    color: colors.easy   },
  { value: 'Medio',     color: colors.medium },
  { value: 'Difficile', color: colors.hard   },
];

// Categorie disponibili (derivate dai trail nel seed)
const AVAILABLE_CATEGORIES = [
  'Natura', 'Fiume', 'Panorami', 'Cultura', 'Famiglie',
  'Storia', 'Bosco', 'Vulcano', 'Trekking', 'Lago',
  'Costa', 'Birdwatching', 'Agricoltura', 'Vigneti',
  'Cascate', 'Archeologia', 'Alta Quota', 'Enogastronomia',
];

// ─── Props ─────────────────────────────────────────────────────────────────

interface Props {
  visible:             boolean;
  filters:             ExploreFilters;
  resultsCount:        number;
  onClose:             () => void;
  onToggleDifficulty:  (d: Difficulty) => void;
  onToggleCategory:    (c: string) => void;
  onDistanceChange:    (r: [number, number]) => void;
  onDurationChange:    (r: [number, number]) => void;
  onElevationChange:   (r: [number, number]) => void;
  onSortChange:        (s: SortOption) => void;
  onReset:             () => void;
}

// ─── Componente ────────────────────────────────────────────────────────────

export const FilterModal: React.FC<Props> = ({
  visible,
  filters,
  resultsCount,
  onClose,
  onToggleDifficulty,
  onToggleCategory,
  onDistanceChange,
  onDurationChange,
  onElevationChange,
  onSortChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const activeFilterCount =
    filters.difficulties.length +
    filters.categories.length +
    (filters.sort !== 'recommended' ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.screen}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={typography.sectionTitle}>{t('explore.filters')}</Text>
            {activeFilterCount > 0 && (
              <View style={styles.activeCountBadge}>
                <Text style={styles.activeCountText}>{activeFilterCount}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={onReset} hitSlop={8}>
            <Text style={styles.resetText}>{t('explore.reset')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Corpo scrollabile ── */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* ── 1. Difficoltà ─────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>{t('explore.difficulty')}</Text>
          <View style={styles.difficultyRow}>
            {DIFFICULTY_OPTIONS.map((opt) => {
              const isActive = filters.difficulties.includes(opt.value);
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.difficultyChip,
                    isActive && { backgroundColor: opt.color, borderColor: opt.color },
                  ]}
                  onPress={() => onToggleDifficulty(opt.value)}
                  activeOpacity={0.75}
                >
                  <View style={[
                    styles.difficultyDot,
                    { backgroundColor: isActive ? '#FFFFFF' : opt.color },
                  ]} />
                  <Text style={[
                    styles.difficultyLabel,
                    isActive && styles.difficultyLabelActive,
                  ]}>
                    {opt.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* ── 2. Categorie ──────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>{t('explore.categories')}</Text>
          <View style={styles.categoriesWrap}>
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isActive = filters.categories.includes(cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => onToggleCategory(cat)}
                  activeOpacity={0.75}
                >
                  <Text style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* ── 3. Statistiche percorso ───────────────────────────────── */}
          <Text style={styles.sectionLabel}>{t('explore.stats')}</Text>

          <RangeFilterRow
            label={t('explore.distance')}
            icon="walk-outline"
            range={filters.distanceRange}
            bounds={FILTER_BOUNDS.distance}
            onChange={onDistanceChange}
          />
          <RangeFilterRow
            label={t('explore.duration')}
            icon="time-outline"
            range={filters.durationRange}
            bounds={FILTER_BOUNDS.duration}
            onChange={onDurationChange}
          />
          <RangeFilterRow
            label={t('explore.elevation')}
            icon="trending-up-outline"
            range={filters.elevationRange}
            bounds={FILTER_BOUNDS.elevation}
            onChange={onElevationChange}
          />

          <View style={styles.divider} />

          {/* ── 4. Ordina per ─────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>{t('explore.sortBy')}</Text>
          {SORT_OPTIONS.map((opt) => {
            const isActive = filters.sort === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={styles.sortRow}
                onPress={() => onSortChange(opt.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.sortLabel, isActive && styles.sortLabelActive]}>
                  {t(opt.labelKey)}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}

        </ScrollView>

        {/* ── Footer — bottone applica ── */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={typography.buttonText}>
              {t('explore.showResults', { count: resultsCount })}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
};

// ─── Stili ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.xxl,
    paddingBottom:     spacing.lg,
    backgroundColor:   colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  activeCountBadge: {
    width:           20,
    height:          20,
    borderRadius:    10,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  activeCountText: {
    fontSize:   11,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  resetText: {
    color:      colors.primary,
    fontWeight: '600',
    fontSize:   14,
  },
  content: {
    padding:       spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    fontSize:        12,
    fontWeight:      '700',
    color:           colors.textMuted,
    textTransform:   'uppercase',
    letterSpacing:   0.5,
    marginBottom:    spacing.md,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
    marginVertical:  spacing.xl,
  },

  // Difficoltà
  difficultyRow: {
    flexDirection: 'row',
    gap:           spacing.sm,
  },
  difficultyChip: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             spacing.xs,
    paddingVertical: spacing.md,
    borderRadius:    radius.lg,
    borderWidth:     1.5,
    borderColor:     colors.border,
    backgroundColor: colors.surface,
  },
  difficultyDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  difficultyLabel: {
    fontSize:   13,
    fontWeight: '700',
    color:      colors.textPrimary,
  },
  difficultyLabelActive: {
    color: '#FFFFFF',
  },

  // Categorie
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    borderRadius:      radius.full,
    borderWidth:       1.5,
    borderColor:       colors.border,
    backgroundColor:   colors.surface,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor:     colors.primary,
  },
  categoryLabel: {
    fontSize:   13,
    fontWeight: '600',
    color:      colors.textSecondary,
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },

  // Sort
  sortRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortLabel: {
    fontSize: 14,
    color:    colors.textSecondary,
  },
  sortLabelActive: {
    color:      colors.textPrimary,
    fontWeight: '700',
  },

  // Footer
  footer: {
    padding:          spacing.lg,
    borderTopWidth:   1,
    borderTopColor:   colors.border,
    backgroundColor:  colors.surface,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius:    radius.lg,
    paddingVertical: spacing.lg,
    alignItems:      'center',
  },
});