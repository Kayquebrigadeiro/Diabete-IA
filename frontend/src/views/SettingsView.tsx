import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Stack, Card, CardContent, TextField, Button } from '@mui/material';

export default function SettingsView() {
  return (
    <AppShell title="Configurações">
      <Stack spacing={2}>
        <SectionHeader title="Preferências" subtitle="Perfil, tema e notificações" />
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Nome" />
              <TextField label="E-mail" />
              <TextField label="Telefone" />
              <Button variant="contained">Salvar</Button>
              <Button color="error">Logout</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

