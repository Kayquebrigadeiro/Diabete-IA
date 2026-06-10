import axios from 'axios';

function clearStoredSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith('active_child_id:')) {
      localStorage.removeItem(key);
      index -= 1;
    }
  }
}

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, ''),
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearStoredSession();
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);
