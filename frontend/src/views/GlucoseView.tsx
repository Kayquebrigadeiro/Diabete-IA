import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card, CardContent, Stack, TextField, Button } from '@mui/material';
import { GlucoseLineChart } from '../components/glucose/GlucoseLineChart';

const data = [
  { time: '08h', value: 85 },
  { time: '12h', value: 140 },
  { time: '16h', value: 210 },
  { time: '20h', value: 190 },
];

export default function GlucoseView() {
  return (
    <AppShell title="Glicemia">
      <Stack spacing={2}>
        <SectionHeader title="Histórico glicêmico" subtitle="Registrar medições e acompanhar tendências" />
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Valor da glicemia" />
              <TextField label="Carboidratos (g)" />
              <Button variant="contained">Registrar</Button>
            </Stack>
          </CardContent>
        </Card>
        <GlucoseLineChart data={data} />
      </Stack>
    </AppShell>
  );
}

