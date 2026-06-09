import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useChildren(userId: string) {
  return useQuery({
    queryKey: ['children', userId],
    queryFn: () => medicalApi.children.list(userId),
    enabled: Boolean(userId),
  });
}

