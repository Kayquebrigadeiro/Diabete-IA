import { api } from './api';
import type { User } from '../types';

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  if (data.user_id) {
    localStorage.setItem('user_id', data.user_id);
  }
  return data;
}

export function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith('active_child_id:')) {
      localStorage.removeItem(key);
      i -= 1;
    }
  }
}

export async function logout() {
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      await api.post('/auth/logout', { token });
    } catch {
      // Logout deve ser resiliente mesmo se a revogação falhar no backend.
    }
  }
  clearSession();
}

export async function register(payload: { name: string; email: string; password: string; phone?: string }) {
  const { data } = await api.post('/auth/register', payload);
  return data as User;
}
