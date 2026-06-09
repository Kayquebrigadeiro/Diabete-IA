import { Card, CardContent } from '@mui/material';
import type { ReactNode } from 'react';

export function GlassCard({ children }: { children: ReactNode }) {
  return (
    <Card elevation={0} sx={{ height: '100%' }}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
