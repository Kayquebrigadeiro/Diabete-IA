import { api } from './api';
import type { ChatAnswer } from '../types';

export async function sendMessage(sessionId: string, message: string, userId: string) {
  const { data } = await api.post<ChatAnswer>(`/chat/sessions/${sessionId}/messages`, { user_id: userId, message });
  return data;
}

