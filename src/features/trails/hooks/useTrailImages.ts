import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchTrailImages } from '../api/trailImagesApi';

export const useTrailImages = (trailId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!trailId) return;

    const channelName = `realtime-trail-images-${trailId}`;
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
          table: 'trail_images',
          filter: `trail_id=eq.${trailId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trailId, queryClient]);

  return useQuery({
    queryKey: ['trail-images', trailId],
    queryFn: () => fetchTrailImages(trailId!),
    enabled: !!trailId,
  });
};