import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => medicalApi.notifications.list(),
    refetchInterval: 30_000,
  });
}
