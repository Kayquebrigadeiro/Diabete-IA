import { useEffect, useRef } from 'react';
import { Alert, Box, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { differenceInYears, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatTile } from '../components/common/StatTile';
import { GlassCard } from '../components/common/GlassCard';
import { GlucoseLineChart } from '../components/glucose/GlucoseLineChart';
import { TimeInRangeDonut } from '../components/glucose/TimeInRangeDonut';
import { useActiveChild } from '../hooks/useActiveChild';

const lineData = [
  { time: '08h', value: 115 },
  { time: '12h', value: 180 },
  { time: '16h', value: 145 },
  { time: '20h', value: 215 },
  { time: '00h', value: 130 },
];

export default function DashboardView() {
  const navigate = useNavigate();
  const redirectedRef = useRef(false);
  const { children, activeChild, isLoading, isSuccess, isError } = useActiveChild();

  useEffect(() => {
    if (isSuccess && children.length === 0 && !redirectedRef.current) {
      redirectedRef.current = true;
      navigate('/onboarding', { replace: true });
    }
  }, [children.length, isSuccess, navigate]);

  if (isLoading || (isSuccess && children.length === 0)) {
    return (
      <AppShell title="Dashboard">
        <Stack spacing={2.25} alignItems="center" justifyContent="center" sx={{ minHeight: '60vh', textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'radial-gradient(circle, rgba(37,99,235,0.18), rgba(37,99,235,0.04))',
              border: '1px solid rgba(37,99,235,0.12)',
            }}
          >
            <CircularProgress size={28} />
          </Box>
          <Box sx={{ maxWidth: 560 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
              Preparando o painel da criança ativa
            </Typography>
            <Typography color="text.secondary">
              Estamos verificando se já existe um perfil para mostrar a rotina certa da família.
            </Typography>
          </Box>
        </Stack>
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell title="Dashboard">
        <Stack spacing={2}>
          <SectionHeader title="Dashboard" subtitle="Painel principal do acompanhamento diário" eyebrow="Falha de carregamento" />
          <Alert severity="error" variant="outlined">
            Não foi possível carregar os dados da criança ativa. Recarregue a página para tentar novamente.
          </Alert>
        </Stack>
      </AppShell>
    );
  }

  const childAge = activeChild ? differenceInYears(new Date(), new Date(activeChild.birth_date)) : null;
  const diagnosisLabel = activeChild?.diagnosis_date ? format(new Date(activeChild.diagnosis_date), 'dd/MM/yyyy') : 'Não informado';
  const birthLabel = activeChild ? format(new Date(activeChild.birth_date), 'dd/MM/yyyy') : 'Não informado';
  const weightLabel = activeChild?.weight_kg ? `${activeChild.weight_kg.toFixed(1)} kg` : 'Peso não informado';

  return (
    <AppShell title="Dashboard">
      <Stack spacing={3}>
        <SectionHeader
          eyebrow="Resumo do dia"
          title={activeChild ? `Olá, família de ${activeChild.name}` : 'Resumo de hoje'}
          subtitle="Visão consolidada do tratamento e do perfil salvo no banco"
          action={null}
        />

        <GlassCard sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.05) 50%, rgba(255,255,255,0) 78%)',
            }}
          >
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={7}>
                <Stack spacing={2.2} sx={{ height: '100%', justifyContent: 'space-between' }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                      <Chip icon={<AutoAwesomeRoundedIcon />} label="Jornada ativa" color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
                      {activeChild ? (
                        <Chip
                          icon={<ChildCareRoundedIcon />}
                          label={activeChild.name}
                          sx={{ background: 'rgba(16,185,129,0.09)', color: 'secondary.dark', fontWeight: 800 }}
                        />
                      ) : null}
                    </Stack>
                    <Typography variant="h3" component="h2">
                      {activeChild ? 'Tudo o que importa, em um só lugar.' : 'Cadastre a criança para começar.'}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: 640, lineHeight: 1.8 }}>
                      O painel prioriza clareza: a criança ativa aparece primeiro, os dados clínicos essenciais ficam visíveis e o restante da rotina
                      pode ser explorado sem esforço.
                    </Typography>
                  </Box>

                  {activeChild ? (
                    <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                      <Chip label={`Nascimento: ${birthLabel}`} variant="outlined" icon={<CalendarMonthRoundedIcon />} />
                      <Chip label={weightLabel} variant="outlined" icon={<ScaleRoundedIcon />} />
                      <Chip label={`Diagnóstico: ${diagnosisLabel}`} variant="outlined" />
                      {childAge !== null ? <Chip label={`${childAge} ano(s)`} color="primary" /> : null}
                    </Stack>
                  ) : null}
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    height: '100%',
                    p: 2.25,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.62)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(18px)',
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 0.8 }}>
                      Organização da família
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,248,255,0.8))',
                        border: '1px solid rgba(15,23,42,0.08)',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        O perfil ativo é selecionado no topo do app. Isso mantém a navegação sempre alinhada com a criança correta.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </GlassCard>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile
              label="Criança ativa"
              value={activeChild?.name ?? 'Perfil não definido'}
              hint={activeChild ? `Nascimento: ${birthLabel}${childAge !== null ? ` • ${childAge} ano(s)` : ''}` : 'Cadastre a criança para começar'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile label="Diagnóstico" value={activeChild?.diagnosis_date ? 'Registrado' : 'Pendente'} hint={`Data: ${diagnosisLabel}`} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile label="Última glicemia" value="115 mg/dL" hint="Há 2 horas • No alvo" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile label="Próximo medicamento" value="Insulina Lispro" hint="4U em 45 minutos" />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <GlassCard sx={{ p: { xs: 2.25, md: 3 } }}>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>
                  Evolução glicêmica
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Linha temporal simplificada para leitura rápida do dia.
                </Typography>
                <GlucoseLineChart data={lineData} />
              </Stack>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <GlassCard sx={{ p: { xs: 2.25, md: 3 } }}>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>
                  Time in Range
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resumo visual para acompanhar estabilidade glicêmica.
                </Typography>
                <TimeInRangeDonut data={[{ name: 'No alvo', value: 75 }, { name: 'Fora', value: 25 }]} />
              </Stack>
            </GlassCard>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <GlassCard sx={{ p: { xs: 2.25, md: 3 } }}>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>
                  Próximos passos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O onboarding já fez o essencial. Agora a família pode enriquecer a rotina aos poucos.
                </Typography>
                <Stack spacing={1.25}>
                  <Typography variant="body2">• Registrar medicamentos e horários.</Typography>
                  <Typography variant="body2">• Adicionar contatos de emergência.</Typography>
                  <Typography variant="body2">• Incluir leituras de glicemia no histórico.</Typography>
                </Stack>
              </Stack>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 4,
                border: '1px solid rgba(15,23,42,0.08)',
                background: 'rgba(255,255,255,0.64)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                A criança principal é carregada direto do banco. O seletor acima permite alternar perfis quando a família tiver mais de um cadastro,
                sem quebrar o fluxo principal.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}
