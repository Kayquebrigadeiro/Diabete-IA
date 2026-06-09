import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { MessageList } from '../components/chat/MessageList';
import type { ChatAnswer } from '../types';

export default function AssistantView() {
  const [answer, setAnswer] = useState<ChatAnswer | null>({
    answer: 'Aplique a regra dos 15g de carboidratos rápidos e reavalie em 15 minutos.',
    confidence_score: 0.93,
    confidence_label: 'Alta',
    citations: [{ document: 'Guia para Pais', chunk_index: 12, excerpt: 'Tratamento da hipoglicemia com 15g.' }],
    fallback: false,
  });

  return (
    <AppShell title="Assistente IA">
      <Stack spacing={2}>
        <SectionHeader title="Assistente RAG" subtitle="Respostas com fontes e confiança" />
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Este assistente baseia-se em protocolos padrão e não substitui a orientação médica profissional.
              </Typography>
              <MessageList answer={answer} />
              <TextField label="Digite sua dúvida..." />
              <Button variant="contained">Enviar</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

