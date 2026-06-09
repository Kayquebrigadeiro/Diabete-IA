import { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlucoseLineChart } from '../components/glucose/GlucoseLineChart';
import { useActiveChild } from '../hooks/useActiveChild';
import { useChildGlucose } from '../hooks/useChildTimeline';
import { medicalApi } from '../services/medical';

export default function GlucoseView() {
  const queryClient = useQueryClient();
  const { activeChild } = useActiveChild();
  const [glucoseValue, setGlucoseValue] = useState('');
  const [carbsGrams, setCarbsGrams] = useState('');
  const childId = activeChild?.id ?? '';
  const childLabel = activeChild?.name ?? 'criança ativa';
  const glucoseQuery = useChildGlucose(childId);

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!activeChild) throw new Error('Selecione uma criança antes de registrar a glicemia.');
      return medicalApi.glucose.create({
        child_id: activeChild.id,
        glucose_value: Number(glucoseValue),
        measurement_type: 'CAPILAR',
        carbs_grams: carbsGrams ? Number(carbsGrams) : 0,
        recorded_at: new Date().toISOString(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['glucose', childId] });
      setGlucoseValue('');
      setCarbsGrams('');
    },
  });

  const chartData = useMemo(
    () =>
      (glucoseQuery.data ?? [])
        .slice()
        .reverse()
        .slice(0, 6)
        .reverse()
        .map((record) => ({
          time: format(new Date(record.recorded_at), 'HH:mm'),
          value: record.glucose_value,
        })),
    [glucoseQuery.data],
  );

  return (
    <AppShell title="Glicemia">
      <Stack spacing={2.5}>
        <SectionHeader
          title={`Histórico glicêmico de ${childLabel}`}
          subtitle="Registrar medições e acompanhar tendências do perfil selecionado"
          eyebrow="Controle diário"
        />

        {!activeChild ? (
          <Alert severity="info" variant="outlined">
            Cadastre uma criança para começar a registrar glicemias.
          </Alert>
        ) : null}

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      Novo registro
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entrada rápida para anotar a medição da criança ativa.
                    </Typography>
                  </Box>
                  <TextField
                    label="Valor da glicemia"
                    type="number"
                    value={glucoseValue}
                    onChange={(event) => setGlucoseValue(event.target.value)}
                    inputProps={{ min: 20, max: 600 }}
                  />
                  <TextField
                    label="Carboidratos (g)"
                    type="number"
                    value={carbsGrams}
                    onChange={(event) => setCarbsGrams(event.target.value)}
                    inputProps={{ min: 0 }}
                  />
                  {registerMutation.isError ? (
                    <Alert severity="error" variant="outlined">
                      Não foi possível registrar a glicemia. Confira os valores.
                    </Alert>
                  ) : null}
                  <Button
                    variant="contained"
                    disabled={!activeChild || registerMutation.isPending || !glucoseValue}
                    onClick={async () => {
                      try {
                        await registerMutation.mutateAsync();
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    {registerMutation.isPending ? 'Registrando...' : 'Registrar'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={800}>
                    Tendência recente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Os últimos registros da criança ativa aparecem abaixo.
                  </Typography>
                  <GlucoseLineChart data={chartData.length ? chartData : [{ time: '08h', value: 85 }]} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h6" fontWeight={800}>
                Últimos registros
              </Typography>
              {glucoseQuery.isLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Carregando registros...
                </Typography>
              ) : glucoseQuery.data?.length ? (
                <Stack spacing={1}>
                  {glucoseQuery.data.slice().reverse().map((record) => (
                    <Box
                      key={record.id}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.72)',
                        border: '1px solid rgba(15,23,42,0.08)',
                      }}
                    >
                      <Typography fontWeight={800}>{record.glucose_value} mg/dL</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(record.recorded_at), 'dd/MM/yyyy HH:mm')} • {record.measurement_type}
                        {record.carbs_grams ? ` • ${record.carbs_grams}g de carboidratos` : ''}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma glicemia registrada ainda para este perfil.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}
