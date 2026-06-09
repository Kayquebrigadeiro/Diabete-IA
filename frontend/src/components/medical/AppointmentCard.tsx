import { Card, CardContent, Stack, Typography } from '@mui/material';

export function AppointmentCard({ title, subtitle, status }: { title: string; subtitle: string; status: string }) {
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
        </Stack>
      </CardContent>
    </Card>
  );
}

