import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useMedications() {
  return useQuery({
    queryKey: ['medications'],
    queryFn: medicalApi.medications.list,
  });
}

