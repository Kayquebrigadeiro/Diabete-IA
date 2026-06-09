import { Stack } from '@mui/material';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { AppointmentCard } from '../components/medical/AppointmentCard';

export default function AppointmentsView() {
  return (
    <AppShell title="Consultas">
      <Stack spacing={2}>
        <SectionHeader title="Consultas médicas" subtitle="Agendar, reagendar e cancelar" />
        <AppointmentCard title="Endocrinologista pediátrico" subtitle="14/06 - 15:30" status="Agendada" />
        <AppointmentCard title="Nutricionista" subtitle="21/06 - 11:00" status="Agendada" />
      </Stack>
    </AppShell>
  );
}

