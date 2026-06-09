import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => medicalApi.notifications.list(userId),
    enabled: Boolean(userId),
  });
}

