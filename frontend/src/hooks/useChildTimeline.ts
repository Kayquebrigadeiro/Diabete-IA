import { useQuery } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';

export function useChildSchedules(childId: string) {
  return useQuery({
    queryKey: ['schedules', childId],
    queryFn: () => medicalApi.schedules.list(childId),
    enabled: Boolean(childId),
  });
}

export function useChildGlucose(childId: string) {
  return useQuery({
    queryKey: ['glucose', childId],
    queryFn: () => medicalApi.glucose.list(childId),
    enabled: Boolean(childId),
  });
}

export function useChildAppointments(childId: string) {
  return useQuery({
    queryKey: ['appointments', childId],
    queryFn: () => medicalApi.appointments.list(childId),
    enabled: Boolean(childId),
  });
}

export function useChildExams(childId: string) {
  return useQuery({
    queryKey: ['exams', childId],
    queryFn: () => medicalApi.exams.list(childId),
    enabled: Boolean(childId),
  });
}
