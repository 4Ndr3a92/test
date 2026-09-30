import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { ExplorePoi } from '@/features/explore/types/exploreFilters';

export const usePoiDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const channelName = `realtime-poi-detail-${id}`;
    const targetTopic = `realtime:${channelName}`;

    // Cerca se esiste già un canale con il topic indicato
    const existingChannel = supabase.getChannels().find((c) => c.topic === targetTopic);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'points_of_interest',
          filter: `id=eq.${id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['poi', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  return useQuery({
    queryKey: ['poi', id],
    queryFn: async (): Promise<ExplorePoi> => {
      if (!id) {
        throw new Error('ID del POI non fornito');
      }

      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw error || new Error('POI non trovato');
      }

      return data as ExplorePoi;
    },
    enabled: !!id,
  });
};