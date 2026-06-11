import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useMedications(childId: string) {
  return useQuery({
    queryKey: ['medications', childId],
    queryFn: () => medicalApi.medications.list(childId),
    enabled: Boolean(childId),
  });
}

