import { api } from './api';
import type { Child, GlucoseRecord, Medication, MedicationSchedule, Notification } from '../types';

export const medicalApi = {
  children: {
    list: async (userId: string) => (await api.get<Child[]>('/children', { params: { user_id: userId } })).data,
    create: async (payload: Partial<Child>) => (await api.post<Child>('/children', payload)).data,
  },
  medications: {
    list: async () => (await api.get<Medication[]>('/medications')).data,
    create: async (payload: Partial<Medication>) => (await api.post<Medication>('/medications', payload)).data,
  },
  schedules: {
    list: async () => (await api.get<MedicationSchedule[]>('/schedules')).data,
    create: async (payload: Partial<MedicationSchedule>) => (await api.post<MedicationSchedule>('/schedules', payload)).data,
  },
  glucose: {
    list: async () => (await api.get<GlucoseRecord[]>('/glucose')).data,
    create: async (payload: Partial<GlucoseRecord>) => (await api.post<GlucoseRecord>('/glucose', payload)).data,
  },
  notifications: {
    list: async (userId: string) => (await api.get<Notification[]>('/notifications', { params: { user_id: userId } })).data,
  },
};

