import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { AppointmentCard } from '../components/medical/AppointmentCard';
import { Stack } from '@mui/material';

export default function SchedulesView() {
  return (
    <AppShell title="Agenda de Medicamentos">
      <Stack spacing={2}>
        <SectionHeader title="Agenda de hoje" subtitle="Linha do tempo da medicação" />
        <AppointmentCard title="08:00 - Café da manhã" subtitle="Insulina Lispro (4U)" status="Tomada" />
        <AppointmentCard title="12:00 - Almoço" subtitle="Insulina Lispro (5U)" status="Tomada" />
        <AppointmentCard title="19:00 - Jantar" subtitle="Insulina Lispro (4U)" status="Atrasado" />
        <AppointmentCard title="22:00 - Dormir" subtitle="Insulina Glargina (12U)" status="Pendente" />
      </Stack>
    </AppShell>
  );
}

