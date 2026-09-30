import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchTrailDetail } from '../api/trailDetailApi';

export const useTrailDetail = (trailId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!trailId) return;

    const channelName = `realtime-trail-detail-${trailId}`;
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
          queryClient.invalidateQueries({ queryKey: ['trail', trailId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trailId, queryClient]);

  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: () => fetchTrailDetail(trailId!),
    enabled: !!trailId,
  });
};