import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { supabase } from '@/config/supabase';
import { fetchAllTrails, fetchAllPois } from '../api/exploreApi'; 
import { ExploreItem } from '../types/exploreFilters';

export const useAllTrails = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channelName = 'realtime-explore-all-data';
    const targetTopic = `realtime:${channelName}`;

    // Pulizia preventiva del canale esistente se presente
    const existingChannel = supabase.getChannels().find((c) => c.topic === targetTopic);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    // Ascolto in Realtime sia dei cambiamenti sui percorsi (trails) che sui punti d'interesse (pois)
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trails' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['explore', 'allData'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pois' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['explore', 'allData'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['explore', 'allData'], 
    queryFn: async (): Promise<ExploreItem[]> => {
      const [trails, pois] = await Promise.all([
        fetchAllTrails(), 
        fetchAllPois(),
      ]);

      const mappedTrails: ExploreItem[] = trails.map((t) => ({
        ...t,
        type: 'route' as const,
      }));

      const mappedPois: ExploreItem[] = pois.map((p) => ({
        ...p,
        type: 'poi' as const,
      }));

      return [...mappedTrails, ...mappedPois];
    },
    staleTime: 1000 * 60 * 10, 
  });
};