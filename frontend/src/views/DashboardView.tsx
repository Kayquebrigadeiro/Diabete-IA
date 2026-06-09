import { Grid, Stack, Typography } from '@mui/material';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatTile } from '../components/common/StatTile';
import { GlucoseLineChart } from '../components/glucose/GlucoseLineChart';
import { TimeInRangeDonut } from '../components/glucose/TimeInRangeDonut';

const lineData = [
  { time: '08h', value: 115 },
  { time: '12h', value: 180 },
  { time: '16h', value: 145 },
  { time: '20h', value: 215 },
  { time: '00h', value: 130 },
];

export default function DashboardView() {
  return (
    <AppShell title="Dashboard">
      <Stack spacing={3}>
        <SectionHeader title="Resumo de hoje" subtitle="Visão consolidada do tratamento" />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StatTile label="Última glicemia" value="115 mg/dL" hint="Há 2 horas - No alvo" />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatTile label="Próximo medicamento" value="Insulina Lispro" hint="4U em 45 minutos" />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatTile label="Próxima consulta" value="14 Jun" hint="Endocrinologia pediátrica" />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatTile label="Alertas ativos" value="1" hint="Lembrete pendente" />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Evolução glicêmica
            </Typography>
            <GlucoseLineChart data={lineData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              Time in Range
            </Typography>
            <TimeInRangeDonut data={[{ name: 'No alvo', value: 75 }, { name: 'Fora', value: 25 }]} />
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}

