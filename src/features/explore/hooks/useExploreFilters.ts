import { useState, useMemo, useEffect } from 'react'; 
import { ExploreFilters, DEFAULT_FILTERS, SortOption, ExploreTab, ExploreItem } from '../types/exploreFilters'; 
import { Difficulty } from '@/shared/type/trail'; 

// Mappatura tra l'ID della Categoria trasmesso dalla Home e la ExploreTab
const CATEGORY_TO_TAB_MAP: Record<string, ExploreTab> = {
  '1': 'route',      // Escursioni -> Tab Percorsi
  '2': 'Natura',     // Gole/Natura -> Tab Categoria POI Nature
  '3': 'Sosta',  // Relax -> Tab Categoria POI Area Sosta
  '4': 'Panoramici',  // Panorami -> Tab Categoria POI Panoramici
};

export const useExploreFilters = (items: ExploreItem[] | undefined, initialCategory?: string) => { 
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS); 
  const [debouncedQuery, setDebouncedQuery] = useState(filters.searchQuery);

  // Imposta automaticamente la tab in base alla categoria ricevuta
  useEffect(() => {
    if (initialCategory) {
      const targetTab = CATEGORY_TO_TAB_MAP[initialCategory] || 'all';
      setFilters((f) => ({
        ...f,
        selectedTab: targetTab,
      }));
    }
  }, [initialCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  const setSearchQuery = (searchQuery: string) => 
    setFilters((f) => ({ ...f, searchQuery })); 

  const setSelectedTab = (selectedTab: ExploreTab) =>
    setFilters((f) => ({ ...f, selectedTab }));

  const toggleDifficulty = (difficulty: Difficulty) => 
    setFilters((f) => ({ 
      ...f, 
      difficulties: f.difficulties.includes(difficulty) 
        ? f.difficulties.filter((d) => d !== difficulty) 
        : [...f.difficulties, difficulty], 
    })); 

  const toggleCategory = (category: string) => 
    setFilters((f) => ({ 
      ...f, 
      categories: f.categories.includes(category) 
        ? f.categories.filter((c) => c !== category) 
        : [...f.categories, category], 
    })); 

  const setDistanceRange = (range: [number, number]) => 
    setFilters((f) => ({ ...f, distanceRange: range })); 

  const setDurationRange = (range: [number, number]) => 
    setFilters((f) => ({ ...f, durationRange: range })); 

  const setElevationRange = (range: [number, number]) => 
    setFilters((f) => ({ ...f, elevationRange: range })); 

  const setSort = (sort: SortOption) => 
    setFilters((f) => ({ ...f, sort })); 

  const resetFilters = () => setFilters(DEFAULT_FILTERS); 

  const activeFilterCount = useMemo(() => { 
    let count = filters.difficulties.length; 
    if (filters.distanceRange[0] !== DEFAULT_FILTERS.distanceRange[0] || 
        filters.distanceRange[1] !== DEFAULT_FILTERS.distanceRange[1]) count++; 
    if (filters.durationRange[0] !== DEFAULT_FILTERS.durationRange[0] || 
        filters.durationRange[1] !== DEFAULT_FILTERS.durationRange[1]) count++; 
    if (filters.elevationRange[0] !== DEFAULT_FILTERS.elevationRange[0] || 
        filters.elevationRange[1] !== DEFAULT_FILTERS.elevationRange[1]) count++; 
    return count; 
  }, [filters]); 

  const filteredTrails = useMemo(() => { 
    if (!items) return []; 

    let result = items.filter((item) => {
      // 1. Filtro Tab Principale
      const matchesTab =
        filters.selectedTab === 'all' ||
        (filters.selectedTab === 'route' && item.type === 'route') ||
        (item.type === 'poi' && item.categories.includes(filters.selectedTab));

      // 2. Ricerca Testuale
      const query = debouncedQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) || 
        item.location?.toLowerCase().includes(query);

      if (!matchesTab || !matchesSearch) return false;

      // Se è un POI salta i filtri tecnici dei trail
      if (item.type === 'poi') return true;

      // 3. Filtri Avanzati per Trail
      const matchesDifficulty = filters.difficulties.length === 0 || filters.difficulties.includes(item.difficulty); 
      const matchesDistance = item.distanceKm >= filters.distanceRange[0] && item.distanceKm <= filters.distanceRange[1]; 
      const matchesDuration = item.durationMin >= filters.durationRange[0] && item.durationMin <= filters.durationRange[1]; 
      const matchesElevation = item.elevationGainM >= filters.elevationRange[0] && item.elevationGainM <= filters.elevationRange[1]; 
      const matchesCategory = filters.categories.length === 0 || filters.categories.some((c) => item.categories?.includes(c)); 

      return matchesDifficulty && matchesDistance && matchesDuration && matchesElevation && matchesCategory; 
    });

    switch (filters.sort) { 
      case 'distanceAsc': 
        result = [...result].sort((a, b) => ((a.type === 'route' ? a.distanceKm : 0) - (b.type === 'route' ? b.distanceKm : 0))); 
        break; 
      case 'distanceDesc': 
        result = [...result].sort((a, b) => ((b.type === 'route' ? b.distanceKm : 0) - (a.type === 'route' ? a.distanceKm : 0))); 
        break; 
      case 'durationAsc': 
        result = [...result].sort((a, b) => ((a.type === 'route' ? a.durationMin : 0) - (b.type === 'route' ? b.durationMin : 0))); 
        break; 
      default: 
        break; 
    } 

    return result; 
  }, [items, filters, debouncedQuery]); 

  return {
    filters, 
    filteredTrails, 
    activeFilterCount, 
    setSearchQuery, 
    setSelectedTab,
    toggleDifficulty, 
    toggleCategory, 
    setDistanceRange, 
    setDurationRange, 
    setElevationRange, 
    setSort, 
    resetFilters, 
  };
};