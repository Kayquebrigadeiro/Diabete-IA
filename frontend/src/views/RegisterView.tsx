import { useState } from 'react';
import { Alert, Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { GlassCard } from '../components/common/GlassCard';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

const passwordRequirementText = 'Use pelo menos 8 caracteres.';

function getRegisterErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { detail?: unknown; error?: { message?: string } } | undefined;
    if (data?.error?.message) {
      return data.error.message;
    }
    if (Array.isArray(data?.detail)) {
      const firstMessage = data.detail.find((item): item is { msg: string } => typeof item?.msg === 'string')?.msg;
      if (firstMessage) {
        return firstMessage;
      }
    }
  }
  return 'Não foi possível criar a conta. Verifique os dados e tente novamente.';
}

function validateRegisterForm(form: RegisterForm) {
  if (form.name.trim().length < 2) {
    return 'Informe um nome com pelo menos 2 caracteres.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Informe um e-mail válido.';
  }
  if (form.password.length < 8) {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }
  return null;
}

export default function RegisterView() {
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [validationError, setValidationError] = useState<string | null>(null);
  const errorMessage = validationError ?? (register.isError ? getRegisterErrorMessage(register.error) : null);

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

                  {errorMessage ? (
                    <Alert severity="error" variant="outlined">
                      {errorMessage}
                    </Alert>
                  ) : null}

                  <Stack spacing={2}>
                    <TextField label="Nome" value={form.name} autoComplete="name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <TextField
                      label="E-mail"
                      type="email"
                      value={form.email}
                      autoComplete="email"
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <TextField
                      label="Telefone"
                      type="tel"
                      value={form.phone}
                      autoComplete="tel"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <TextField
                      label="Senha"
                      type="password"
                      value={form.password}
                      autoComplete="new-password"
                      helperText={passwordRequirementText}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    size="large"
                    disabled={register.isPending}
                    onClick={async () => {
                      const nextValidationError = validateRegisterForm(form);
                      setValidationError(nextValidationError);
                      if (nextValidationError) {
                        return;
                      }
                      try {
                        await register.mutateAsync({
                          name: form.name.trim(),
                          email: form.email.trim(),
                          password: form.password,
                          phone: form.phone.trim() || undefined,
                        });
                        navigate('/login');
                      } catch {
                        // A mutation guarda o erro para renderizar o alerta acima.
                      }
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
