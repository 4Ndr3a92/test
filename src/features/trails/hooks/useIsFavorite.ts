import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchIsFavorite } from '../api/trailDetailApi';
import { useAuthStore } from '../../auth/store/authStore';

export const useIsFavorite = (trailId: string | null) => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id || !trailId) return;

    const channel = supabase
      .channel(`realtime-is-favorite-${trailId}-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `trail_id=eq.${trailId}&user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['trail', trailId, 'isFavorite', user.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trailId, user?.id, queryClient]);

  return useQuery({
    queryKey: ['trail', trailId, 'isFavorite', user?.id],
    queryFn: () => fetchIsFavorite(trailId!, user!.id),
    enabled: !!user && !!trailId,
  });
};