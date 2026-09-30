import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchMapTrails } from '../api/mapApi';

export const useMapTrails = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channelName = 'realtime-map-trails';
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
        { event: '*', schema: 'public', table: 'trails' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['map', 'trails'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['map', 'trails'],
    queryFn: fetchMapTrails,
  });
};