import { Chip } from '@mui/material';

export function ConfidenceBadge({ value }: { value: number }) {
  const label = value >= 0.9 ? 'Alta' : value >= 0.7 ? 'Moderada' : 'Baixa';
  const color = value >= 0.9 ? 'success' : value >= 0.7 ? 'warning' : 'default';
  return <Chip size="small" color={color as any} label={`Confiança: ${label}`} />;
}

