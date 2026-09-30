import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview } from '../api/trailDetailApi';
import { useAuthStore } from '@/features/auth/store/authStore';

interface Payload {
  trailId: string;
  reviewId: string;
  rating: number;
  comment: string;
}

export const useUpdateReview = (trailId: string) => {
  const queryClient = useQueryClient();
   const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: ({ reviewId, rating, comment }: Payload) =>
      updateReview(trailId, reviewId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'reviews', 'mine', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['trail', trailId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', user?.id] });
    },
  });
};