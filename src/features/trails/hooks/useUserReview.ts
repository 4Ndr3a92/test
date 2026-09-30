import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchUserReviewForTrail } from '../api/trailDetailApi';
import { useAuthStore } from '../../auth/store/authStore';

export const useUserReview = (trailId: string) => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id || !trailId) return;

    const channelName = `realtime-user-review-${trailId}-${user.id}`;
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
          filter: `trail_id=eq.${trailId}&user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['trail', trailId, 'reviews', 'mine', user.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trailId, user?.id, queryClient]);

  return useQuery({
    queryKey: ['trail', trailId, 'reviews', 'mine', user?.id],
    queryFn: () => fetchUserReviewForTrail(trailId, user!.id),
    enabled: !!user && !!trailId,
  });
};