import { useAuthStore } from "@/features/auth/store/authStore";
import { toggleTrailFavorite } from "@/features/trails/api/trailDetailApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useToggleProfileFavorite = (trailId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: () => toggleTrailFavorite(trailId, user!.id,true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail', trailId, 'isFavorite'] });
    },
  });
};