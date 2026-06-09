import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Stack, Card, CardContent, Typography } from '@mui/material';

export default function ExamsView() {
  return (
    <AppShell title="Exames">
      <Stack spacing={2}>
        <SectionHeader title="Exames laboratoriais" subtitle="Pedidos e resultados" />
        <Card>
          <CardContent>
            <Typography fontWeight={800}>Hemoglobina glicada</Typography>
            <Typography variant="body2" color="text.secondary">
              7.2% - realizado em 10/06
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

