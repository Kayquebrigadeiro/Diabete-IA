import { useMutation } from '@tanstack/react-query';
import { login, logout, register } from '../services/auth';
import { useAuthContext } from '../context/AuthContext';

export function useLogin() {
  const { setUserId } = useAuthContext();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => {
      if (data.user_id) {
        setUserId(data.user_id);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

export function useLogout() {
  const { clearUserId } = useAuthContext();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUserId();
    },
  });
}
