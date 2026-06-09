import { useState } from 'react';
import { Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

export default function LoginView() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('mae@guardian.ai');
  const [password, setPassword] = useState('12345678');

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h4" fontWeight={800}>
              Diabetes Guardian AI
            </Typography>
            <Typography color="text.secondary">Acesso seguro ao cuidado diário.</Typography>
            <TextField label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button
              size="large"
              variant="contained"
              onClick={async () => {
                await login.mutateAsync({ email, password });
                navigate('/');
              }}
            >
              Entrar
            </Button>
            <Button variant="text" onClick={() => navigate('/register')}>
              Criar conta
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

