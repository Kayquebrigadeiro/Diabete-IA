import { useMemo, useState } from 'react';
import { Alert, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { AppointmentCard } from '../components/medical/AppointmentCard';
import { useActiveChild } from '../hooks/useActiveChild';
import { useChildSchedules } from '../hooks/useChildTimeline';
import { useMedications } from '../hooks/useMedications';
import { medicalApi } from '../services/medical';
import type { MedicationSchedule } from '../types';

const timeOptions = ['07:00', '08:00', '12:00', '18:00', '22:00'];

export default function SchedulesView() {
  const queryClient = useQueryClient();
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const schedulesQuery = useChildSchedules(activeChild?.id ?? '');
  const medicationsQuery = useMedications(activeChild?.id ?? '');
  const [doseAmount, setDoseAmount] = useState('');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [notes, setNotes] = useState('');
  const [medicationId, setMedicationId] = useState('');
  const [editingId, setEditingId] = useState('');

  const currentSchedule = useMemo<MedicationSchedule | null>(
    () => schedulesQuery.data?.find((item) => item.id === editingId) ?? null,
    [editingId, schedulesQuery.data],
  );

  const resetForm = () => {
    setEditingId('');
    setDoseAmount('');
    setScheduledTime('08:00');
    setNotes('');
    setMedicationId('');
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!activeChild) throw new Error('Selecione uma criança.');
      const payload = {
        child_id: activeChild.id,
        medication_id: medicationId,
        dose_amount: Number(doseAmount),
        scheduled_time: scheduledTime,
        notes: notes || null,
      };
      return editingId ? medicalApi.schedules.update(editingId, payload) : medicalApi.schedules.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules', activeChild?.id ?? ''] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (scheduleId: string) => medicalApi.schedules.delete(scheduleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules', activeChild?.id ?? ''] });
      if (editingId) resetForm();
    },
  });

  const startEdit = (schedule: MedicationSchedule) => {
    setEditingId(schedule.id);
    setDoseAmount(String(schedule.dose_amount));
    setScheduledTime(schedule.scheduled_time);
    setNotes(schedule.notes ?? '');
    setMedicationId(schedule.medication_id);
  };

  return (
    <AppShell title="Agenda de Medicamentos">
      <Stack spacing={2}>
        <SectionHeader title={`Agenda de ${childLabel}`} subtitle="Linha do tempo da medicação organizada para o perfil selecionado" eyebrow="Rotina" />

        {!activeChild ? <Alert severity="info">Cadastre uma criança para visualizar a agenda.</Alert> : null}

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800}>
                {editingId ? 'Editar tomada' : 'Criar tomada'}
              </Typography>
              <TextField label="Dose (U)" type="number" value={doseAmount} onChange={(e) => setDoseAmount(e.target.value)} disabled={!activeChild} />
              <TextField select label="Medicamento" value={medicationId} onChange={(e) => setMedicationId(e.target.value)} disabled={!activeChild}>
                {(medicationsQuery.data ?? []).map((medication) => (
                  <MenuItem key={medication.id} value={medication.id}>
                    {medication.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Horário" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} disabled={!activeChild}>
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Observações" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!activeChild} />
              {saveMutation.isError ? <Alert severity="error">Não foi possível salvar a agenda.</Alert> : null}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  disabled={!activeChild || !doseAmount || !medicationId || saveMutation.isPending}
                  onClick={async () => {
                    try {
                      await saveMutation.mutateAsync();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  {saveMutation.isPending ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar agenda'}
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

        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h6" fontWeight={800}>
                Próximas tomadas
              </Typography>
              {schedulesQuery.isLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Carregando horários de medicamentos...
                </Typography>
              ) : schedulesQuery.data?.length ? (
                <Stack spacing={1.5}>
                  {schedulesQuery.data.map((schedule) => {
                    const medicationName = medicationsQuery.data?.find((item) => item.id === schedule.medication_id)?.name ?? 'Medicamento';
                    return (
                      <AppointmentCard
                        key={schedule.id}
                        title={`${schedule.dose_amount}U • ${format(new Date(`1970-01-01T${schedule.scheduled_time}`), 'HH:mm')}`}
                        subtitle={`${medicationName}${schedule.notes ? ` • ${schedule.notes}` : ''}`}
                        status="Programada"
                        actions={
                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="outlined" onClick={() => startEdit(schedule)}>
                              Editar
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={async () => {
                                if (!window.confirm('Excluir esta tomada?')) return;
                                await deleteMutation.mutateAsync(schedule.id);
                              }}
                            >
                              Excluir
                            </Button>
                          </Stack>
                        }
                      />
                    );
                  })}
                </Stack>
              ) : (
                <Alert severity="info" variant="outlined">
                  Nenhum horário cadastrado ainda. Adicione medicamentos e doses para organizar a rotina diária.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}
