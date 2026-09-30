import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchTrailRoute } from '../api/mapApi';

export const useTrailRoute = (trailId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!trailId) return;

    const channelName = `realtime-trail-route-${trailId}`;
    const targetTopic = `realtime:${channelName}`;

    // Pulizia preventiva del canale esistente
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
          table: 'trails',
          filter: `id=eq.${trailId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['map', 'route', trailId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trailId, queryClient]);

  return useQuery({
    queryKey: ['map', 'route', trailId],
    queryFn: () => fetchTrailRoute(trailId!),
    enabled: !!trailId,
  });
};