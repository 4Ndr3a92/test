import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchAllMapPois } from '../api/mapApi';

export const useAllMapPois = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Sottoscrizione alle modifiche della tabella 'points_of_interest'
    const channel = supabase
      .channel('realtime-map-pois')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'points_of_interest' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['map', 'pois', 'all'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['map', 'pois', 'all'],
    queryFn: fetchAllMapPois,
  });
};