import { useState } from 'react';
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { AppointmentCard } from '../components/medical/AppointmentCard';
import { useActiveChild } from '../hooks/useActiveChild';
import { useChildAppointments } from '../hooks/useChildTimeline';
import { medicalApi } from '../services/medical';
import type { Appointment } from '../types';

export default function AppointmentsView() {
  const queryClient = useQueryClient();
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const appointmentsQuery = useChildAppointments(activeChild?.id ?? '');
  const [professionalName, setProfessionalName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [appointmentAt, setAppointmentAt] = useState('');
  const [editingId, setEditingId] = useState('');

  const resetForm = () => {
    setEditingId('');
    setProfessionalName('');
    setSpecialty('');
    setAppointmentAt('');
  };

  const currentAppointment = appointmentsQuery.data?.find((item) => item.id === editingId) ?? null;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!activeChild) throw new Error('Selecione uma criança.');
      const payload = {
        child_id: activeChild.id,
        professional_name: professionalName,
        specialty,
        appointment_at: new Date(appointmentAt).toISOString(),
        status: 'AGENDADA',
      };
      return editingId ? medicalApi.appointments.update(editingId, payload) : medicalApi.appointments.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments', activeChild?.id ?? ''] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (appointmentId: string) => medicalApi.appointments.delete(appointmentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments', activeChild?.id ?? ''] });
      if (editingId) resetForm();
    },
  });

  const startEdit = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setProfessionalName(appointment.professional_name);
    setSpecialty(appointment.specialty);
    setAppointmentAt(appointment.appointment_at.slice(0, 16));
  };

  return (
    <AppShell title="Consultas">
      <Stack spacing={2}>
        <SectionHeader title={`Consultas de ${childLabel}`} subtitle="Visão rápida do acompanhamento médico" eyebrow="Consultas" />
        {!activeChild ? <Alert severity="info">Cadastre uma criança para acompanhar consultas.</Alert> : null}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={800}>
                {editingId ? 'Editar consulta' : 'Nova consulta'}
              </Typography>
              <TextField label="Profissional" value={professionalName} onChange={(e) => setProfessionalName(e.target.value)} disabled={!activeChild} />
              <TextField label="Especialidade" value={specialty} onChange={(e) => setSpecialty(e.target.value)} disabled={!activeChild} />
              <TextField label="Data e hora" type="datetime-local" InputLabelProps={{ shrink: true }} value={appointmentAt} onChange={(e) => setAppointmentAt(e.target.value)} disabled={!activeChild} />
              {saveMutation.isError ? <Alert severity="error">Não foi possível salvar a consulta.</Alert> : null}
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  disabled={!activeChild || !professionalName || !specialty || !appointmentAt || saveMutation.isPending}
                  onClick={async () => {
                    try {
                      await saveMutation.mutateAsync();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  {saveMutation.isPending ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar consulta'}
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
        {appointmentsQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Carregando consultas da criança...
          </Typography>
        ) : appointmentsQuery.data?.length ? (
          <Stack spacing={2}>
            {appointmentsQuery.data.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                title={appointment.professional_name}
                subtitle={`${appointment.specialty} • ${format(new Date(appointment.appointment_at), 'dd/MM/yyyy HH:mm')}`}
                status={appointment.status}
                actions={
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => startEdit(appointment)}>
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={async () => {
                        if (!window.confirm('Excluir esta consulta?')) return;
                        await deleteMutation.mutateAsync(appointment.id);
                      }}
                    >
                      Excluir
                    </Button>
                  </Stack>
                }
              />
            ))}
          </Stack>
        ) : (
          <Alert severity="info" variant="outlined">
            Nenhuma consulta cadastrada ainda. Adicione endocrinologistas, nutricionistas e outras consultas para acompanhar a rotina médica.
          </Alert>
        )}
      </Stack>
    </AppShell>
  );
}
