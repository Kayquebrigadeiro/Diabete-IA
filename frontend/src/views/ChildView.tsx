import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { Card, CardContent, Stack, TextField, Button } from '@mui/material';

export default function ChildView() {
  return (
    <AppShell title="Perfil da Criança">
      <Stack spacing={2}>
        <SectionHeader title="Dados da criança" subtitle="Perfil clínico e peso atual" />
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Nome" />
              <TextField label="Data de nascimento" />
              <TextField label="Peso atual (kg)" />
              <TextField label="Data do diagnóstico" />
              <Button variant="contained">Salvar</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}

