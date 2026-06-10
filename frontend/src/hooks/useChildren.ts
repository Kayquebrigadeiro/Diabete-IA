import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';
import type { Appointment, Child, Exam, GlucoseRecord, Medication, MedicationSchedule, Notification, User } from '../types';

// ============= CHILDREN =============
export function useChildren() {
  return useQuery({
    queryKey: ['children'],
    queryFn: () => medicalApi.children.list(),
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Child, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      medicalApi.children.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
  });
}

// ============= MEDICATIONS =============
export function useMedications() {
  return useQuery({
    queryKey: ['medications'],
    queryFn: () => medicalApi.medications.list(),
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Medication, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      medicalApi.medications.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ medicationId, payload }: { medicationId: string; payload: Partial<Medication> }) =>
      medicalApi.medications.update(medicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (medicationId: string) => medicalApi.medications.delete(medicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

// ============= SCHEDULES =============
export function useSchedules(childId: string) {
  return useQuery({
    queryKey: ['schedules', childId],
    queryFn: () => medicalApi.schedules.list(childId),
    enabled: Boolean(childId),
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<MedicationSchedule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      medicalApi.schedules.create(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', payload.child_id.toString()] });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, payload }: { scheduleId: string; payload: Partial<MedicationSchedule> }) =>
      medicalApi.schedules.update(scheduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) => medicalApi.schedules.delete(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

// ============= GLUCOSE =============
export function useGlucose(childId: string) {
  return useQuery({
    queryKey: ['glucose', childId],
    queryFn: () => medicalApi.glucose.list(childId),
    enabled: Boolean(childId),
  });
}

export function useCreateGlucose() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<GlucoseRecord, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      medicalApi.glucose.create(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['glucose', payload.child_id.toString()] });
    },
  });
}

// ============= APPOINTMENTS =============
export function useAppointments(childId: string) {
  return useQuery({
    queryKey: ['appointments', childId],
    queryFn: () => medicalApi.appointments.list(childId),
    enabled: Boolean(childId),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      medicalApi.appointments.create(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', payload.child_id.toString()] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, payload }: { appointmentId: string; payload: Partial<Appointment> }) =>
      medicalApi.appointments.update(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, newTime, reason }: { appointmentId: string; newTime: string; reason: string }) =>
      medicalApi.appointments.reschedule(appointmentId, newTime, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason: string }) =>
      medicalApi.appointments.cancel(appointmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: string) => medicalApi.appointments.delete(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// ============= EXAMS =============
export function useExams(childId: string) {
  return useQuery({
    queryKey: ['exams', childId],
    queryFn: () => medicalApi.exams.list(childId),
    enabled: Boolean(childId),
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Exam, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
      medicalApi.exams.create(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['exams', payload.child_id.toString()] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, payload }: { examId: string; payload: Partial<Exam> }) =>
      medicalApi.exams.update(examId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => medicalApi.exams.delete(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

// ============= NOTIFICATIONS =============
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => medicalApi.notifications.list(),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => medicalApi.notifications.markRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => medicalApi.notifications.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ============= USERS =============
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => medicalApi.users.getMe(),
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<User>) => medicalApi.users.updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

export function useDeleteCurrentUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => medicalApi.users.deleteMe(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

