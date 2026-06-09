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

export async function register(payload: { name: string; email: string; password: string; phone?: string }) {
  const { data } = await api.post('/auth/register', payload);
  return data as User;
}
