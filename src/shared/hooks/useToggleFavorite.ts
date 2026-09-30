import { useAuthStore } from '@/features/auth/store/authStore';
import { toggleTrailFavorite } from '@/features/trails/api/trailDetailApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ trailId, isFavorite }: { trailId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Non autenticato');
      return toggleTrailFavorite(trailId, user.id, isFavorite);
    },

    // Ottimistic update: aggiorna la cache degli id preferiti immediatamente
    // senza aspettare la risposta del server
    onMutate: async ({ trailId, isFavorite }) => {
      const queryKey = ['favorites', 'ids', user?.id];

      await queryClient.cancelQueries({ queryKey });

      const previousIds = queryClient.getQueryData<string[]>(queryKey) ?? [];
    
      queryClient.setQueryData<string[]>(queryKey, (old = []) =>
        
        isFavorite
          ? old.filter((id) => id !== trailId)   // rimuovi
          : [...old, trailId]                      // aggiungi
      );

      return { previousIds };
    },

    // Se la chiamata fallisce, ripristina la cache precedente
    onError: (_err, _vars, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(
          ['favorites', 'ids', user?.id],
          context.previousIds
        );
      }
    },

    // In ogni caso, sincronizza con il server dopo la mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'ids', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'trails', user?.id] });
    },
  });
};