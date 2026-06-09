import { useState } from 'react';
import { Alert, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { GlassCard } from '../components/common/GlassCard';

export default function LoginView() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('mae@guardian.ai');
  const [password, setPassword] = useState('12345678');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <GlassCard sx={{ height: '100%' }}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 3,
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
                    Acesso seguro
                  </Typography>
                  <Typography variant="h2" component="h1" sx={{ mt: 1 }}>
                    Diabetes Guardian AI
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
                    Um espaço desenhado para famílias que precisam entrar, entender e agir sem perder tempo com telas confusas.
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.68)',
                      border: '1px solid rgba(15,23,42,0.08)',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ShieldRoundedIcon color="primary" />
                      <Box>
                        <Typography fontWeight={700}>Autenticação protegida</Typography>
                        <Typography variant="body2" color="text.secondary">
                          A sessão fica isolada e é encerrada corretamente ao sair.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.68)',
                      border: '1px solid rgba(15,23,42,0.08)',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <LocalHospitalRoundedIcon color="secondary" />
                      <Box>
                        <Typography fontWeight={700}>Fluxo clínico enxuto</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Primeiro cadastro rápido. Depois, rotinas, medicamentos e histórico.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.68)',
                      border: '1px solid rgba(15,23,42,0.08)',
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TimelineRoundedIcon color="primary" />
                      <Box>
                        <Typography fontWeight={700}>Leitura rápida</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Menos ruído visual, mais foco no que importa agora.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <GlassCard sx={{ height: '100%' }}>
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
                      Entrar
                    </Typography>
                    <Typography variant="h4" component="h2" fontWeight={800} sx={{ mt: 1 }}>
                      Continue de onde parou
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.8 }}>
                      Acesso direto ao dashboard, com redirecionamento automático para o onboarding se a criança ainda não tiver sido cadastrada.
                    </Typography>
                  </Box>

                  {login.isError ? (
                    <Alert severity="error" variant="outlined">
                      Não foi possível entrar com essas credenciais. Confira o e-mail e a senha.
                    </Alert>
                  ) : null}

                  <Stack spacing={2}>
                    <TextField label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                    <TextField
                      label="Senha"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Stack>

                  <Button
                    size="large"
                    variant="contained"
                    disabled={login.isPending}
                    onClick={async () => {
                      try {
                        await login.mutateAsync({ email, password });
                        navigate('/');
                      } catch {
                        // Erro já é exibido pelo estado da mutation.
                      }
                    }}
                  >
                    {login.isPending ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.58)',
                      border: '1px solid rgba(15,23,42,0.08)',
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Ainda não tem conta?
                      </Typography>
                      <Button variant="text" onClick={() => navigate('/register')} sx={{ alignSelf: 'flex-start', px: 0 }}>
                        Criar conta
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
