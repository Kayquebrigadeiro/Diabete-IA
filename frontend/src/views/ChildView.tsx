import { Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { GlassCard } from '../components/common/GlassCard';
import { useActiveChild } from '../hooks/useActiveChild';

export default function ChildView() {
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'a criança ativa';

  return (
    <AppShell title="Perfil da criança">
      <Stack spacing={2.5}>
        <SectionHeader
          eyebrow="Cadastro clínico"
          title={`Dados de ${childLabel}`}
          subtitle="Perfil clínico, peso atual e data do diagnóstico em uma tela simples de manter."
        />

        <GlassCard sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <ChildCareRoundedIcon color="primary" />
                        <Box>
                          <Typography fontWeight={800}>Identificação</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Nome e contexto principal
                          </Typography>
                        </Box>
                      </Stack>
                      <TextField label="Nome" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <CalendarMonthRoundedIcon color="secondary" />
                        <Box>
                          <Typography fontWeight={800}>Cronologia</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Nascimento e diagnóstico
                          </Typography>
                        </Box>
                      </Stack>
                      <TextField label="Data de nascimento" type="date" InputLabelProps={{ shrink: true }} />
                      <TextField label="Data do diagnóstico" type="date" InputLabelProps={{ shrink: true }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <ScaleRoundedIcon color="primary" />
                        <Box>
                          <Typography fontWeight={800}>Peso atual</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Atualização simples para cálculo e acompanhamento
                          </Typography>
                        </Box>
                      </Stack>
                      <TextField label="Peso atual (kg)" type="number" inputProps={{ step: '0.1', min: 0 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={1.5} sx={{ height: '100%' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <LocalHospitalRoundedIcon color="secondary" />
                        <Box>
                          <Typography fontWeight={800}>Próximos módulos</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Medicamentos, histórico e contatos de emergência entram depois.
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Esta tela pode evoluir para edição completa do perfil da criança, mantendo a simplicidade como regra.
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
              Salvar
            </Button>
          </Stack>
        </GlassCard>
      </Stack>
    </AppShell>
  );
}
