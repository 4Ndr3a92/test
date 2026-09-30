import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { toggleTrailFavorite } from '@/features/trails/api/trailDetailApi';

export const useToggleHomeFavorite = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ trailId, isFavorite }: { trailId: string; isFavorite: boolean }) =>
      toggleTrailFavorite(trailId, user!.id, isFavorite),
    onSuccess: (_, { trailId }) => {
      // Invalida la lista degli ID dei preferiti usata in HomeScreen
      queryClient.invalidateQueries({ queryKey: ['favorites', 'ids'] });
      // Invalida anche la lista completa delle card preferite e il singolo dettaglio
      queryClient.invalidateQueries({ queryKey: ['favorites', 'trails'] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'isFavorite'] });
    },
  });
};