import { useMutation } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useAuthStore } from '../store/authStore';
import { supabase } from '@/config/supabase';

export const useLogout = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async () => {
      // 1. Logout da Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 2. Logout dall'SDK nativo di Google
      // Se l'utente non era loggato con Google, catturiamo l'errore per evitare blocchi
      try {
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.log('Google Sign-In non era attivo o già scollegato:', googleError);
      }
    },
    onSuccess: () => {
      // 3. Pulisce lo stato globale dell'utente
      setUser(null);
    },
  });
};