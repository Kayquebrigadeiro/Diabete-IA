import { useState } from 'react';
import { Alert, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { GlassCard } from '../components/common/GlassCard';

export default function RegisterView() {
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

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
              <Box sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                <Stack spacing={2.5} sx={{ height: '100%' }}>
                  <Box>
                    <Typography variant="overline" sx={{ letterSpacing: 2, color: 'primary.main', fontWeight: 800 }}>
                      Criar conta
                    </Typography>
                    <Typography variant="h2" component="h1" sx={{ mt: 1 }}>
                      Comece com uma estrutura clara.
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
                      O cadastro precisa ser rápido o suficiente para não atrapalhar o primeiro acesso e, ao mesmo tempo, confiável para o
                      acompanhamento contínuo.
                    </Typography>
                  </Box>

                  <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.68)',
                        border: '1px solid rgba(15,23,42,0.08)',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PersonAddRoundedIcon color="primary" />
                        <Box>
                          <Typography fontWeight={700}>Registro curto</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Nome, e-mail e senha. O restante pode ser ajustado depois.
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
                        <ManageAccountsRoundedIcon color="secondary" />
                        <Box>
                          <Typography fontWeight={700}>Perfil familiar</Typography>
                          <Typography variant="body2" color="text.secondary">
                            A experiência já nasce pronta para adicionar a criança principal.
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
                        <LockRoundedIcon color="primary" />
                        <Box>
                          <Typography fontWeight={700}>Sessão protegida</Typography>
                          <Typography variant="body2" color="text.secondary">
                            O login é restaurado depois do cadastro, sem passos desnecessários.
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
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
                      Dados básicos
                    </Typography>
                    <Typography variant="h4" component="h2" fontWeight={800} sx={{ mt: 1 }}>
                      Abra a conta da família
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.8 }}>
                      Depois do cadastro, a pessoa entra no login e segue para o wizard da criança se ainda não houver perfil criado.
                    </Typography>
                  </Box>

                  {register.isError ? (
                    <Alert severity="error" variant="outlined">
                      Não foi possível criar a conta. Verifique os dados e tente novamente.
                    </Alert>
                  ) : null}

                  <Stack spacing={2}>
                    <TextField label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <TextField label="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <TextField label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <TextField
                      label="Senha"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    size="large"
                    disabled={register.isPending}
                    onClick={async () => {
                      await register.mutateAsync(form);
                      navigate('/login');
                    }}
                  >
                    {register.isPending ? 'Criando...' : 'Criar conta'}
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
                        Já tem uma conta?
                      </Typography>
                      <Button variant="text" onClick={() => navigate('/login')} sx={{ alignSelf: 'flex-start', px: 0 }}>
                        Voltar para login
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
