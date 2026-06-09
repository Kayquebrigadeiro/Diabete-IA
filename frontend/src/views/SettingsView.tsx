import { Alert, Box, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { useLogout } from '../hooks/useAuth';

export default function SettingsView() {
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <AppShell title="Configurações">
      <Stack spacing={2.5}>
        <SectionHeader
          eyebrow="Preferências"
          title="Ajustes da conta e da experiência"
          subtitle="Aqui ficam as preferências de uso, os dados básicos e a saída segura da sessão."
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Stack spacing={2.25}>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      Perfil
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dados simples para manter a experiência clara e acessível.
                    </Typography>
                  </Box>
                  <TextField label="Nome" />
                  <TextField label="E-mail" />
                  <TextField label="Telefone" />
                  <Button variant="contained">Salvar alterações</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <PaletteRoundedIcon color="primary" />
                      <Box>
                        <Typography fontWeight={800}>Visual limpo</Typography>
                        <Typography variant="body2" color="text.secondary">
                          O app usa superfícies suaves e contraste alto para leitura fácil.
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <NotificationsActiveRoundedIcon color="secondary" />
                      <Box>
                        <Typography fontWeight={800}>Alertas visíveis</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Erros e confirmações aparecem sem poluir a tela.
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Alert severity="info" variant="outlined">
                O logout limpa sessão e cache. Você também pode sair pelo botão do topo do app.
              </Alert>

              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6" fontWeight={800}>
                      Encerrar sessão
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use esta ação quando for trocar de conta ou proteger o acesso em outro dispositivo.
                    </Typography>
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<LogoutRoundedIcon />}
                      onClick={async () => {
                        await logout.mutateAsync();
                        navigate('/login', { replace: true });
                      }}
                      disabled={logout.isPending}
                    >
                      {logout.isPending ? 'Saindo...' : 'Encerrar sessão'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
}
