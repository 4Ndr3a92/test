import { useMutation } from '@tanstack/react-query';
import { registerWithEmail, RegisterPayload } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerWithEmail(payload),
    onSuccess: (user) => setUser(user),
  });
};