import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useGlucose(childId: string) {
  return useQuery({
    queryKey: ['glucose', childId],
    queryFn: () => medicalApi.glucose.list(childId),
    enabled: Boolean(childId),
  });
}
