import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReview } from '../api/trailDetailApi';

import { useAuthStore } from '../../auth/store/authStore';
import { NewReviewPayload } from '../types/trail';

export const useSubmitReview = (trailId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (payload: NewReviewPayload) =>
      submitReview(
        payload, 
        user!.id, 
        user!.user_metadata?.full_name ?? 'Utente',
        user!.user_metadata?.avatar_url ?? undefined,
        
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews', 'mine', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', user?.id] });
    },
  });
};