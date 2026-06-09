import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '../services/chat';

export function useRAGChat(sessionId: string, userId: string) {
  return useMutation({
    mutationFn: (message: string) => sendMessage(sessionId, message, userId),
  });
}

