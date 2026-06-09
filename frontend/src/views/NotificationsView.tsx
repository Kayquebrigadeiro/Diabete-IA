import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Stack, Card, CardContent, Typography } from '@mui/material';

export default function NotificationsView() {
  return (
    <AppShell title="Notificações">
      <Stack spacing={2}>
        <SectionHeader title="Central de alertas" subtitle="Medicamentos, consultas e glicemia" />
        <Card>
          <CardContent>
            <Typography fontWeight={800}>Dose pendente</Typography>
            <Typography variant="body2" color="text.secondary">
              Insulina Lispro às 19:00.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

