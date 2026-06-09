import { useState } from 'react';
import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';

export default function RegisterView() {
  const navigate = useNavigate();
  const register = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h4" fontWeight={800}>
              Cadastro
            </Typography>
            <TextField label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextField label="Senha" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button
              variant="contained"
              onClick={async () => {
                await register.mutateAsync(form);
                navigate('/login');
              }}
            >
              Criar conta
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

