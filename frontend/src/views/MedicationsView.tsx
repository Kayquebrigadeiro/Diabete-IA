import { Alert, Stack, Typography } from '@mui/material';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { MedicationCard } from '../components/medical/MedicationCard';
import { useActiveChild } from '../hooks/useActiveChild';
import { useMedications } from '../hooks/useMedications';

export default function MedicationsView() {
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const medicationsQuery = useMedications();

  return (
    <AppShell title="Medicamentos">
      <Stack spacing={2}>
        <SectionHeader
          title={`Medicamentos de ${childLabel}`}
          subtitle="Catálogo usado para montar a terapia e apoiar o cuidado diário"
          eyebrow="Terapia"
        />

        {!activeChild ? <Alert severity="info">Cadastre uma criança para organizar a rotina de medicamentos.</Alert> : null}

        {medicationsQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Carregando lista de medicamentos da criança...
          </Typography>
        ) : medicationsQuery.data?.length ? (
          <Stack spacing={2}>
            {medicationsQuery.data.map((item) => (
              <MedicationCard key={item.id} item={item} />
            ))}
          </Stack>
        ) : (
          <Alert severity="info" variant="outlined">
            Nenhum medicamento registrado ainda. Cadastre insulinas, horários e doses para acompanhar a rotina completa da criança.
          </Alert>
        )}
      </Stack>
    </AppShell>
  );
}
