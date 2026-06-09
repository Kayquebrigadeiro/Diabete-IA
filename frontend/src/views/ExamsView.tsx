import { useState } from 'react';
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { useActiveChild } from '../hooks/useActiveChild';
import { useChildExams } from '../hooks/useChildTimeline';
import { medicalApi } from '../services/medical';
import type { Exam } from '../types';

export default function ExamsView() {
  const queryClient = useQueryClient();
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const examsQuery = useChildExams(activeChild?.id ?? '');
  const [name, setName] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [requestedAt, setRequestedAt] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  const [editingId, setEditingId] = useState('');

  const resetForm = () => {
    setEditingId('');
    setName('');
    setRequestedBy('');
    setRequestedAt('');
    setDueAt('');
    setStatus('PENDENTE');
  };

  const currentExam = examsQuery.data?.find((item) => item.id === editingId) ?? null;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!activeChild) throw new Error('Selecione uma criança.');
      const payload = {
        child_id: activeChild.id,
        name,
        requested_by: requestedBy || null,
        requested_at: requestedAt || new Date().toISOString().slice(0, 10),
        due_at: dueAt || null,
        status,
      };
      return editingId ? medicalApi.exams.update(editingId, payload) : medicalApi.exams.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams', activeChild?.id ?? ''] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (examId: string) => medicalApi.exams.delete(examId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams', activeChild?.id ?? ''] });
      if (editingId) resetForm();
    },
  });

  const startEdit = (exam: Exam) => {
    setEditingId(exam.id);
    setName(exam.name);
    setRequestedBy(exam.requested_by ?? '');
    setRequestedAt(exam.requested_at);
    setDueAt(exam.due_at ?? '');
    setStatus(exam.status);
  };

  return (
    <AppShell title="Exames">
      <Stack spacing={2}>
        <SectionHeader title={`Exames de ${childLabel}`} subtitle="Pedidos e resultados ligados ao perfil selecionado" eyebrow="Exames" />
        {!activeChild ? <Alert severity="info">Cadastre uma criança para acompanhar exames.</Alert> : null}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800}>
                {editingId ? 'Editar exame' : 'Novo exame'}
              </Typography>
              <TextField label="Nome do exame" value={name} onChange={(e) => setName(e.target.value)} disabled={!activeChild} />
              <TextField label="Solicitado por" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} disabled={!activeChild} />
              <TextField label="Data da solicitação" type="date" InputLabelProps={{ shrink: true }} value={requestedAt} onChange={(e) => setRequestedAt(e.target.value)} disabled={!activeChild} />
              <TextField label="Prazo" type="date" InputLabelProps={{ shrink: true }} value={dueAt} onChange={(e) => setDueAt(e.target.value)} disabled={!activeChild} />
              <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={!activeChild} />
              {saveMutation.isError ? <Alert severity="error">Não foi possível salvar o exame.</Alert> : null}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  disabled={!activeChild || !name || saveMutation.isPending}
                  onClick={async () => {
                    try {
                      await saveMutation.mutateAsync();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  {saveMutation.isPending ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar exame'}
                </Button>
                {editingId ? (
                  <Button variant="outlined" onClick={resetForm}>
                    Cancelar
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        {examsQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Carregando exames da criança...
          </Typography>
        ) : examsQuery.data?.length ? (
          <Stack spacing={2}>
            {examsQuery.data.map((exam) => (
              <Card key={exam.id}>
                <CardContent>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={800}>{exam.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Solicitado em {format(new Date(exam.requested_at), 'dd/MM/yyyy')}
                      {exam.due_at ? ` • Prazo: ${format(new Date(exam.due_at), 'dd/MM/yyyy')}` : ''}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>
                      {exam.status}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => startEdit(exam)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={async () => {
                          if (!window.confirm('Excluir este exame?')) return;
                          await deleteMutation.mutateAsync(exam.id);
                        }}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Alert severity="info" variant="outlined">
            Nenhum exame cadastrado ainda. Registre hemoglobina glicada, glicemia de jejum e outros pedidos médicos para acompanhar.
          </Alert>
        )}
      </Stack>
    </AppShell>
  );
}
