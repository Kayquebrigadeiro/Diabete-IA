import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useGlucose() {
  return useQuery({
    queryKey: ['glucose'],
    queryFn: medicalApi.glucose.list,
  });
}

