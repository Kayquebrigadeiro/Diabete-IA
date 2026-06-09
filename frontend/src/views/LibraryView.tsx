import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Stack, Card, CardContent, Typography } from '@mui/material';
import { useActiveChild } from '../hooks/useActiveChild';

export default function LibraryView() {
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'a criança';

  return (
    <AppShell title="Biblioteca">
      <Stack spacing={2}>
        <SectionHeader title={`Biblioteca para ${childLabel}`} subtitle="Conteúdo confiável para responsáveis e para a rotina do cuidado" />
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
