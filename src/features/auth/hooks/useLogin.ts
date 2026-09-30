import { useMutation } from '@tanstack/react-query';
import { loginWithEmail, LoginPayload } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginWithEmail(payload),
    onSuccess: (user) => setUser(user),
  });
};