import { Stack } from '@mui/material';
import { ChatBubble } from '../common/ChatBubble';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { CitationCard } from '../common/CitationCard';
import type { ChatAnswer } from '../../types';

export function MessageList({ answer }: { answer?: ChatAnswer | null }) {
  if (!answer) return null;
  return (
    <Stack spacing={2}>
      <ChatBubble role="assistant" text={answer.answer} />
      <ConfidenceBadge value={answer.confidence_score} />
      <Stack spacing={1}>
        {answer.citations.map((citation) => (
          <CitationCard key={`${citation.document}-${citation.chunk_index}`} citation={citation} />
        ))}
      </Stack>
    </Stack>
  );
}

