import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from '../api/trailDetailApi';
import { useAuthStore } from '@/features/auth/store/authStore';

interface Payload {
  trailId: string;
  reviewId: string;
}

export const useDeleteReview = (trailId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: ({ reviewId }: Payload) => deleteReview(trailId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews', 'mine', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', user?.id] });
    },
  });
};