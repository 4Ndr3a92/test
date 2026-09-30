import { useState } from 'react'; 
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native'; 
import { router, useLocalSearchParams } from 'expo-router'; 
import { useAllTrails } from '../hooks/useAllTrails'; 
import { useExploreFilters } from '../hooks/useExploreFilters'; 
import { colors, spacing } from '@/shared/theme'; 
import { EmptyState } from '../components/EmptyState'; 
import { ExploreSearchBar } from '../components/ExploreSearchBar'; 
import { FilterChipsRow } from '../components/FilterChipsRow'; 
import { ResultsHeader } from '../components/ResultsHeader'; 
import { ExploreTrailCard } from '../components/ExploreTrailCard'; 
import { FilterModal } from '../components/FilterModal'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { ExploreItem } from '../types/exploreFilters';

export const ExploreScreen: React.FC = () => { 
  const [filterModalVisible, setFilterModalVisible] = useState(false); 
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { data: items, isLoading, isError } = useAllTrails(); 

  const {
    filters, 
    filteredTrails, 
    activeFilterCount, 
    setSearchQuery, 
    setSelectedTab,
    toggleCategory, 
    toggleDifficulty, 
    setDistanceRange, 
    setDurationRange, 
    setElevationRange, 
    setSort, 
    resetFilters, 
  } = useExploreFilters(items,category); 

  const handleItemPress = (item: ExploreItem) => {
    if (item.type === 'route') {
      router.push({
        pathname: '/trails/[id]',
        params: { id: item.id }, 
      });
    } else {

      router.push({
        pathname: '/pois/[id]',
        params: { id: item.id },
      });
    }
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
      <View style={styles.center}> 
        <EmptyState onReset={resetFilters} /> 
      </View> 
    ); 
  } 

  return (
    <SafeAreaView style={styles.screen} edges={['top']}> 
      <ExploreSearchBar 
        value={filters.searchQuery} 
        onChangeText={setSearchQuery} 
        onFilterPress={() => setFilterModalVisible(true)} 
        activeFilterCount={activeFilterCount} 
      />

      <FilterChipsRow
        selectedTab={filters.selectedTab}
        onSelectTab={setSelectedTab}
      />
 
      <FlatList 
        style={styles.list} 
        data={filteredTrails} 
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.listContent} 
        ListHeaderComponent={<ResultsHeader count={filteredTrails.length} />} 
        ListEmptyComponent={<EmptyState onReset={resetFilters} />} 
        renderItem={({ item }) => ( 
          <ExploreTrailCard 
            item={item} 
            onPress={() => handleItemPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false} 
      />

      <FilterModal 
        visible={filterModalVisible} 
        filters={filters} 
        resultsCount={filteredTrails.length} 
        onClose={() => setFilterModalVisible(false)} 
        onToggleDifficulty={toggleDifficulty} 
        onToggleCategory={toggleCategory} 
        onDistanceChange={setDistanceRange} 
        onDurationChange={setDurationRange} 
        onElevationChange={setElevationRange} 
        onSortChange={setSort} 
        onReset={resetFilters} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, 
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }, 
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, flexGrow: 1 }, 
  list: { flex: 1 }, 
});