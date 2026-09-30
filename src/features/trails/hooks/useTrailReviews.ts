import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchTrailReviews } from '../api/trailDetailApi';

export const useTrailReviews = (trailId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!trailId) return;

    const channelName = `realtime-trail-reviews-${trailId}`;
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
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `trail_id=eq.${trailId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews'] });
          queryClient.invalidateQueries({ queryKey: ['trail', trailId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trailId, queryClient]);

  return useQuery({
    queryKey: ['trail', trailId, 'reviews'],
    queryFn: () => fetchTrailReviews(trailId),
    enabled: !!trailId,
  });
};