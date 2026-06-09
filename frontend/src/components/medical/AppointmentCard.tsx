import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export function AppointmentCard({
  title,
  subtitle,
  status,
  actions,
}: {
  title: string;
  subtitle: string;
  status: string;
  actions?: ReactNode;
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={700}>
            {status}
          </Typography>
          {actions ? <Box sx={{ pt: 1 }}>{actions}</Box> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
