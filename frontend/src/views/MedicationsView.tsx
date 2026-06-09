import { Stack } from '@mui/material';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { MedicationCard } from '../components/medical/MedicationCard';

const medications = [
  { id: '1', name: 'Insulina Glargina', type: 'Lenta', description: '12U/dia' },
  { id: '2', name: 'Insulina Lispro', type: 'Rápida', description: 'Fator 1:15' },
  { id: '3', name: 'Glucagon', type: 'Emergência', description: 'Uso em hipoglicemia grave' },
];

export default function MedicationsView() {
  return (
    <AppShell title="Medicamentos">
      <Stack spacing={2}>
        <SectionHeader title="Meus medicamentos" subtitle="Cadastro e controle da terapia" />
        <Stack spacing={2}>
          {medications.map((item) => (
            <MedicationCard key={item.id} item={item as any} />
          ))}
        </Stack>
      </Stack>
    </AppShell>
  );
}

