import { useMutation } from '@tanstack/react-query';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { loginWithAppleNative } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useAppleLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async () => {
      // 1. Avvia la richiesta di autenticazione nativa Apple
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error('Nessun Identity Token restituito da Apple');
      }

      // 2. Invia token e nonce a Supabase
      return await loginWithAppleNative({ token: identityToken, nonce });
    },
    onSuccess: (user) => {
      if (user) setUser(user);
    },
  });
};