import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Review } from '../types/trail';

export interface UserReview extends Review {
  trailId: string;
  trailName: string;
}

const fetchUserReviews = async (userId: string): Promise<UserReview[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, user_id, user_name, rating, comment, created_at, trail_id,
      trails ( name )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    comment: r.comment,
    createdAt: new Date(r.created_at).getTime(),
    trailId: r.trail_id,
    trailName: r.trails?.name ?? '',
  }));
};

export const useUserReviews = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `realtime-user-all-reviews-${user.id}`;
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
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['reviews', 'user', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return useQuery({
    queryKey: ['reviews', 'user', user?.id],
    queryFn: () => fetchUserReviews(user!.id),
    enabled: !!user,
  });
};