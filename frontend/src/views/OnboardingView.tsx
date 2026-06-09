import { useEffect, useMemo, useRef } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, Container, Grid, Stack, TextField, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { medicalApi } from '../services/medical';
import { useAuthContext } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { useChildren } from '../hooks/useChildren';

const onboardingSchema = z
  .object({
    name: z.string().trim().min(2, 'Informe o nome da criança'),
    birthDate: z.string().min(1, 'Informe a data de nascimento'),
    diagnosisDate: z.string().min(1, 'Informe a data do diagnóstico'),
    weightKg: z.coerce.number().positive('Informe um peso válido'),
  })
  .refine(
    (values) => {
      const birthDate = new Date(values.birthDate);
      const diagnosisDate = new Date(values.diagnosisDate);
      return Number.isNaN(birthDate.getTime()) || Number.isNaN(diagnosisDate.getTime()) || diagnosisDate >= birthDate;
    },
    {
      message: 'A data do diagnóstico deve ser igual ou posterior ao nascimento',
      path: ['diagnosisDate'],
    },
  );

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function OnboardingView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();
  const redirectedRef = useRef(false);
  const {
    data: children = [],
    isLoading,
    isSuccess,
  } = useChildren(userId);

  const activeChild = useMemo(() => children[0] ?? null, [children]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      diagnosisDate: '',
      weightKg: undefined,
    },
  });

  useEffect(() => {
    if (isSuccess && activeChild && !redirectedRef.current) {
      redirectedRef.current = true;
      navigate('/', { replace: true });
    }
  }, [activeChild, isSuccess, navigate]);

  const onSubmit = async (formData: OnboardingForm) => {
    if (!userId) {
      toast.error('Sessão inválida. Entre novamente para continuar.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      await medicalApi.children.create({
        name: formData.name.trim(),
        birth_date: formData.birthDate,
        diagnosis_date: formData.diagnosisDate,
        weight_kg: formData.weightKg,
      });
      await queryClient.invalidateQueries({ queryKey: ['children', userId] });
      toast.success('Perfil da criança criado com sucesso.');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Erro ao criar perfil da criança:', error);
      toast.error('Não foi possível salvar os dados. Verifique e tente novamente.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
        background:
          'radial-gradient(circle at top left, rgba(44, 138, 255, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(60, 187, 126, 0.16), transparent 30%), linear-gradient(135deg, rgba(248,252,255,0.92), rgba(234,243,255,0.86))',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <Stack spacing={3} sx={{ height: '100%', justifyContent: 'center' }}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 2,
                    color: 'primary.main',
                    fontWeight: 800,
                  }}
                >
                  Primeira configuração
                </Typography>
                <Typography variant="h3" component="h1" sx={{ mt: 1, mb: 2 }}>
                  Vamos preparar o perfil da criança em um passo único.
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  Informar apenas o essencial reduz atrito no primeiro acesso. Depois disso, você continua para o dashboard e completa medicamentos,
                  rotina e histórico com calma.
                </Typography>
              </Box>

              <Alert severity="info" variant="outlined">
                Se a criança já tiver sido cadastrada, o sistema volta automaticamente para o dashboard.
              </Alert>

              <Stack spacing={1.5}>
                <Typography fontWeight={700}>O que vamos coletar agora</Typography>
                <Typography color="text.secondary">Nome da criança, data de nascimento, data do diagnóstico e peso atual.</Typography>
                <Typography color="text.secondary">
                  Medicamentos, consultas, glicemias e histórico clínico podem ser incluídos depois, sem travar o início do uso.
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <GlassCard sx={{ overflow: 'hidden' }}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(44,138,255,0.08), rgba(60,187,126,0.06) 55%, rgba(255,255,255,0))',
                    pointerEvents: 'none',
                  },
                }}
              >
                {isLoading ? (
                  <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 420, position: 'relative' }}>
                    <CircularProgress />
                    <Typography color="text.secondary">Verificando se já existe uma criança cadastrada...</Typography>
                  </Stack>
                ) : (
                  <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ position: 'relative' }} noValidate>
                    <Box>
                      <Typography variant="h5" component="h2" fontWeight={800}>
                        Cadastro inicial
                      </Typography>
                      <Typography color="text.secondary">
                        Esse formulário é curto por design. O objetivo é colocar a família para dentro sem exigir esforço desnecessário.
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Nome da criança"
                          autoComplete="off"
                          required
                          fullWidth
                          error={Boolean(errors.name)}
                          helperText={errors.name?.message ?? 'Como a criança deve aparecer no sistema'}
                          {...register('name')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Data de nascimento"
                          type="date"
                          required
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.birthDate)}
                          helperText={errors.birthDate?.message ?? 'Usado para contexto clínico'}
                          {...register('birthDate')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Data do diagnóstico"
                          type="date"
                          required
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={Boolean(errors.diagnosisDate)}
                          helperText={errors.diagnosisDate?.message ?? 'Ajuda a contextualizar o acompanhamento'}
                          {...register('diagnosisDate')}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Peso atual (kg)"
                          type="number"
                          required
                          fullWidth
                          inputProps={{ min: 0, step: '0.1' }}
                          error={Boolean(errors.weightKg)}
                          helperText={errors.weightKg?.message ?? 'Você pode ajustar esse dado depois'}
                          {...register('weightKg')}
                        />
                      </Grid>
                    </Grid>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                      <Button variant="outlined" color="inherit" onClick={() => navigate('/', { replace: true })}>
                        Voltar ao dashboard
                      </Button>
                      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar e continuar'}
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
