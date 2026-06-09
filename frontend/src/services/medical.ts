import { api } from './api';
import type { Appointment, Child, Exam, GlucoseRecord, Medication, MedicationSchedule, Notification } from '../types';

export const medicalApi = {
  children: {
    list: async (userId: string) => (await api.get<Child[]>('/children', { params: { user_id: userId } })).data,
    create: async (payload: Omit<Child, 'id' | 'user_id'>) => (await api.post<Child>('/children', payload)).data,
  },
  medications: {
    list: async () => (await api.get<Medication[]>('/medications')).data,
    create: async (payload: Partial<Medication>) => (await api.post<Medication>('/medications', payload)).data,
  },
  schedules: {
    list: async (childId: string) => (await api.get<MedicationSchedule[]>('/schedules', { params: { child_id: childId } })).data,
    create: async (payload: Partial<MedicationSchedule>) => (await api.post<MedicationSchedule>('/schedules', payload)).data,
    update: async (scheduleId: string, payload: Partial<MedicationSchedule>) =>
      (await api.put<MedicationSchedule>(`/schedules/${scheduleId}`, payload)).data,
    delete: async (scheduleId: string) => (await api.delete<MedicationSchedule>(`/schedules/${scheduleId}`)).data,
  },
  glucose: {
    list: async (childId: string) => (await api.get<GlucoseRecord[]>('/glucose', { params: { child_id: childId } })).data,
    create: async (payload: Partial<GlucoseRecord>) => (await api.post<GlucoseRecord>('/glucose', payload)).data,
  },
  appointments: {
    list: async (childId: string) => (await api.get<Appointment[]>('/appointments', { params: { child_id: childId } })).data,
    create: async (payload: Partial<Appointment>) => (await api.post<Appointment>('/appointments', payload)).data,
    update: async (appointmentId: string, payload: Partial<Appointment>) =>
      (await api.put<Appointment>(`/appointments/${appointmentId}`, payload)).data,
    delete: async (appointmentId: string) => (await api.delete<Appointment>(`/appointments/${appointmentId}`)).data,
  },
  exams: {
    list: async (childId: string) => (await api.get<Exam[]>('/exams', { params: { child_id: childId } })).data,
    create: async (payload: Partial<Exam>) => (await api.post<Exam>('/exams', payload)).data,
    update: async (examId: string, payload: Partial<Exam>) => (await api.put<Exam>(`/exams/${examId}`, payload)).data,
    delete: async (examId: string) => (await api.delete<Exam>(`/exams/${examId}`)).data,
  },
  notifications: {
    list: async (userId: string) => (await api.get<Notification[]>('/notifications', { params: { user_id: userId } })).data,
  },
};
