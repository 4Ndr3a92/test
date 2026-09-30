import React from 'react'; 
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../../shared/theme'; 
import { ExploreTab } from '../types/exploreFilters';

interface Props {
  selectedTab: ExploreTab;
  onSelectTab: (tab: ExploreTab) => void;
}

const TABS: { id: ExploreTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'Tutti', icon: 'grid-outline' },
  { id: 'route', label: 'Percorsi', icon: 'trail-sign-outline' },
  { id: 'Natura', label: 'Natura', icon: 'water-outline' },
  { id: 'Panoramici', label: 'Punti Panoramici', icon: 'camera-outline' },
  { id: 'Sosta', label: 'Aree Ristoro', icon: 'cafe-outline' },

];

export const FilterChipsRow: React.FC<Props> = ({ selectedTab, onSelectTab }) => (
  <View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.row} 
    >
      {TABS.map((tab) => {
        const isActive = selectedTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7} 
          >
            <Ionicons
              name={tab.icon}
              size={15}
              color={isActive ? '#FFFFFF' : colors.textPrimary} 
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  row: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md, marginVertical: 10 }, 
  chip: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.sm, 
    borderRadius: radius.full, 
    borderWidth: 1.5, 
    borderColor: colors.border, 
    backgroundColor: colors.surface, 
    flexShrink: 0, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 3, 
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.textPrimary }, 
  labelActive: { color: '#FFFFFF' }, 
});