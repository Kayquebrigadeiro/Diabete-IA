import { api } from './api';
import type { Appointment, Child, Exam, GlucoseRecord, Medication, MedicationSchedule, Notification, User } from '../types';

export const medicalApi = {
  // CHILDREN - Child profile management
  children: {
    list: async () => (await api.get<Child[]>('/children')).data,
    create: async (payload: Omit<Child, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => 
      (await api.post<Child>('/children', payload)).data,
  },

  // MEDICATIONS - Global medication catalog
  medications: {
    list: async (childId: string) => (await api.get<Medication[]>('/medications', { params: { child_id: childId } })).data,
    create: async (payload: Omit<Medication, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => 
      (await api.post<Medication>('/medications', payload)).data,
    update: async (medicationId: string, payload: Partial<Medication>) =>
      (await api.put<Medication>(`/medications/${medicationId}`, payload)).data,
    delete: async (medicationId: string) => (await api.delete<Medication>(`/medications/${medicationId}`)).data,
  },

  // SCHEDULES - Medication schedules for a child
  schedules: {
    list: async (childId: string) => (await api.get<MedicationSchedule[]>('/schedules', { params: { child_id: childId } })).data,
    create: async (payload: Omit<MedicationSchedule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => 
      (await api.post<MedicationSchedule>('/schedules', payload)).data,
    update: async (scheduleId: string, payload: Partial<MedicationSchedule>) =>
      (await api.put<MedicationSchedule>(`/schedules/${scheduleId}`, payload)).data,
    delete: async (scheduleId: string) => (await api.delete<MedicationSchedule>(`/schedules/${scheduleId}`)).data,
  },

  // GLUCOSE - Blood glucose readings
  glucose: {
    list: async (childId: string) => (await api.get<GlucoseRecord[]>('/glucose', { params: { child_id: childId } })).data,
    create: async (payload: Omit<GlucoseRecord, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => 
      (await api.post<GlucoseRecord>('/glucose', payload)).data,
  },

  // APPOINTMENTS - Doctor appointments
  appointments: {
    list: async (childId: string) => (await api.get<Appointment[]>('/appointments', { params: { child_id: childId } })).data,
    create: async (payload: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => 
      (await api.post<Appointment>('/appointments', payload)).data,
    update: async (appointmentId: string, payload: Partial<Appointment>) =>
      (await api.put<Appointment>(`/appointments/${appointmentId}`, payload)).data,
    reschedule: async (appointmentId: string, newTime: string, reason: string) =>
      (await api.put<Appointment>(`/appointments/${appointmentId}/reschedule`, { new_time: newTime, reason })).data,
    cancel: async (appointmentId: string, reason: string) =>
      (await api.put<Appointment>(`/appointments/${appointmentId}/cancel`, { reason })).data,
    delete: async (appointmentId: string) => (await api.delete<Appointment>(`/appointments/${appointmentId}`)).data,
  },

  // EXAMS - Lab exams and tests
  exams: {
    list: async (childId: string) => (await api.get<Exam[]>('/exams', { params: { child_id: childId } })).data,
    create: async (payload: Omit<Exam, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) => 
      (await api.post<Exam>('/exams', payload)).data,
    update: async (examId: string, payload: Partial<Exam>) =>
      (await api.put<Exam>(`/exams/${examId}`, payload)).data,
    delete: async (examId: string) => (await api.delete<Exam>(`/exams/${examId}`)).data,
  },

  // NOTIFICATIONS - User notifications
  notifications: {
    list: async () => (await api.get<Notification[]>('/notifications')).data,
    markRead: async (notificationId: string) =>
      (await api.put<Notification>(`/notifications/${notificationId}/read`)).data,
    delete: async (notificationId: string) => (await api.delete<Notification>(`/notifications/${notificationId}`)).data,
  },

  // USERS - User profile management
  users: {
    getMe: async () => (await api.get<User>('/users/me')).data,
    updateMe: async (payload: Partial<User>) => (await api.put<User>('/users/me', payload)).data,
    deleteMe: async () => (await api.delete<User>('/users/me')).data,
  },
};
