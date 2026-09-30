import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '../../auth/store/authStore';
import { updateProfile, UpdateProfilePayload } from '../api/profileApi';


export const useUpdateProfile = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfile(user!.id, payload),
    onSuccess: async () => {
      // Rilegge l'utente aggiornato da Supabase e aggiorna lo store Zustand
      const { data: { user: updatedUser } } = await import('../../../config/supabase')
        .then(({ supabase }) => supabase.auth.getUser());
      if (updatedUser) setUser(updatedUser);
    },
  });
};