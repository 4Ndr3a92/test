import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../auth/store/authStore';
import { supabase } from '@/config/supabase';
import { CardTrail, mapRowToTrail } from '@/features/home/api/homeApi';

const fetchFavoriteTrails = async (userId: string): Promise<CardTrail[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      trail_id,
      trails(id, name, description, location, distance_km, duration_min, difficulty, thumbnail_url, imageUrl)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Errore durante il recupero dei preferiti:', error);
    throw error;
  }

  return (data ?? [])
    .map((row: any) => row.trails)
    .filter((trail: any) => trail !== null)
    .map(mapRowToTrail);
};

export const useFavoriteTrails = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `realtime-favorite-trails-${user.id}`;
    const targetTopic = `realtime:${channelName}`;

    // Pulizia preventiva del canale esistente se presente
    const existingChannel = supabase.getChannels().find((c) => c.topic === targetTopic);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    // Ascolto in Realtime dei cambiamenti sulla tabella 'favorites' per l'utente attivo
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['favorites', 'trails', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return useQuery({
    queryKey: ['favorites', 'trails', user?.id],
    queryFn: () => fetchFavoriteTrails(user!.id),
    enabled: !!user?.id,
    staleTime: 0,
  });
};