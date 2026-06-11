import { useState } from 'react';
import { api } from '../services/api';
import type { ChatAnswer } from '../types';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  answer?: ChatAnswer;
};

export function useRAGChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const getOrCreateSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    const { data } = await api.post('/chat/sessions', { user_id: userId, title: 'Nova Conversa' });
    setSessionId(data.id);
    return data.id;
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);
    try {
      const sid = await getOrCreateSession();
      const { data } = await api.post<ChatAnswer>(`/chat/sessions/${sid}/messages`, {
        user_id: userId,
        message,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer, answer: data }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, tive um problema para me conectar ao servidor. Tente novamente.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
}

