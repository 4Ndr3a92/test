import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchTrailsCount } from '../api/homeApi';

export const useTrailsCount = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-trails-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trails',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['home', 'trails', 'count'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['home', 'trails', 'count'],
    queryFn: fetchTrailsCount,
  });
};