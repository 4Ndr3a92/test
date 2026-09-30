import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleTrailFavorite } from '../api/trailDetailApi';
import { useAuthStore } from '../../auth/store/authStore';

export const useToggleFavorite = (trailId: string | null, isFavorite: boolean) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: () => toggleTrailFavorite(trailId!, user!.id, isFavorite),
    onSuccess: () => {
      if (user?.id && trailId) {
        // Invalida lo stato del singolo trail includendo user.id per allinearlo con useIsFavorite
        queryClient.invalidateQueries({
          queryKey: ['trail', trailId, 'isFavorite', user.id],
        });
      }
      // Invalida le query generali dei preferiti (per la Home e la tab Preferiti)
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};