import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import type { Medication } from '../../types';

export function MedicationCard({ item }: { item: Medication }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.2}>
          <Typography variant="h6" fontWeight={800}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.medication_type} • {item.dosage} • {item.frequency}
            {item.notes ? ` - ${item.notes}` : ''}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined">
              Editar
            </Button>
            <Button size="small" color="error" variant="outlined">
              Excluir
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

