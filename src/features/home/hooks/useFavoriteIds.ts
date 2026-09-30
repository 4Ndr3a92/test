import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/features/auth/store/authStore';

const fetchFavoriteIds = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('trail_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((row) => row.trail_id);
};

export const useFavoriteIds = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`realtime-favorites-ids-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['favorites', 'ids', user.id] });
          queryClient.invalidateQueries({ queryKey: ['favorites', 'trails', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return useQuery({
    queryKey: ['favorites', 'ids', user?.id],
    queryFn: () => fetchFavoriteIds(user!.id),
    enabled: !!user?.id,
  });
};