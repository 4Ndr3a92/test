import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../features/auth/store/authStore';
import { supabase } from '@/config/supabase';

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

  return useQuery({
    queryKey: ['favorites', 'ids', user?.id],
    queryFn: () => fetchFavoriteIds(user!.id),
    enabled: !!user,
   
  });
};