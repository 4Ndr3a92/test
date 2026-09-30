
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export interface ProfileReview {
  id: string;
  trail_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  trail?: {
    id: string;
    name: string;
  };
}

// Key unica per React Query
export const PROFILE_REVIEWS_QUERY_KEY = ['profile-reviews'];

/**
 * Hook per recuperare tutte le recensioni scritte dall'utente autenticato,
 * incluse le informazioni (nome) del percorso associato.
 */
export const useProfileReviews = () => {
  const user = useAuthStore((s) => s.user);

  return useQuery<ProfileReview[]>({
    queryKey: [...PROFILE_REVIEWS_QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          trail_id,
          user_id,
          rating,
          comment,
          created_at,
          trail:trails (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data as unknown as ProfileReview[]) || [];
    },
    enabled: !!user?.id,
  });
};

/**
 * Hook Mutation per ELIMINARE una recensione
 */
export const useDeleteProfileReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalida le query per aggiornare la lista delle recensioni del profilo
      queryClient.invalidateQueries({ queryKey: PROFILE_REVIEWS_QUERY_KEY });
    },
  });
};

/**
 * Hook Mutation per MODIFICARE una recensione
 */
export interface UpdateReviewPayload {
  reviewId: string;
  rating: number;
  comment?: string;
}

export const useUpdateProfileReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, rating, comment }: UpdateReviewPayload) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_REVIEWS_QUERY_KEY });
    },
  });
};