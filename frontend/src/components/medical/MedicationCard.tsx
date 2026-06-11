import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import type { Medication } from '../../types';

export function MedicationCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Medication;
  onEdit?: (item: Medication) => void;
  onDelete?: (item: Medication) => void;
}) {
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
            {onEdit && (
              <Button size="small" variant="outlined" onClick={() => onEdit(item)}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button size="small" color="error" variant="outlined" onClick={() => onDelete(item)}>
                Excluir
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
