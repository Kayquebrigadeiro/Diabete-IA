import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Stack, Card, CardContent, Typography } from '@mui/material';

export default function LibraryView() {
  return (
    <AppShell title="Biblioteca">
      <Stack spacing={2}>
        <SectionHeader title="Biblioteca educacional" subtitle="Conteúdo confiável para responsáveis" />
        <Card>
          <CardContent>
            <Typography fontWeight={800}>Hipoglicemia: ação rápida</Typography>
            <Typography variant="body2" color="text.secondary">
              Regra dos 15g de carboidratos rápidos e reavaliação em 15 minutos.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

