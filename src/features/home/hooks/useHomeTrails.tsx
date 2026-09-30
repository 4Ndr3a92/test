import { useEffect, useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { fetchAllHomeTrails } from '../api/homeApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Difficulty } from '@/shared/type/trail';

type Filter = 'Tutti' | Difficulty;

export const useHomeTrails = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [activeFilter, setActiveFilter] = useState<Filter>('Tutti');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const channelName = 'realtime-home-trails';
    const targetTopic = `realtime:${channelName}`;

    // Rimuove un eventuale canale preesistente prima di registrarne uno nuovo
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
          table: 'trails',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['home', 'trails', 'all'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home', 'trails', 'all'],
    queryFn: fetchAllHomeTrails,
  });

  const urbano = useMemo(() => {
    if (!data) return [];
    return data.filter((t) => t.categories.includes('Urbano'));
  }, [data]);

  const principale = useMemo(() => {
    if (!data) return [];
    return data.filter((t) => t.categories.includes('Parco'));
  }, [data]);

  return {
    principale,
    urbano,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
  };
};