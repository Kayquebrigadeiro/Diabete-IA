import { useMutation } from '@tanstack/react-query';
import { login, register } from '../services/auth';

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

