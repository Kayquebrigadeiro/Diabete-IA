import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Chip,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  TextField,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicationIcon from '@mui/icons-material/Medication';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLogout } from '../../hooks/useAuth';
import { useActiveChild } from '../../hooks/useActiveChild';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
  { label: 'Medicamentos', icon: <MedicationIcon />, to: '/medications' },
  { label: 'Glicemia', icon: <ShowChartIcon />, to: '/glucose' },
  { label: 'Chat IA', icon: <SmartToyIcon />, to: '/assistant' },
  { label: 'Config', icon: <SettingsIcon />, to: '/settings' },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const { children: childList, activeChild, activeChildId, setActiveChildId, isLoading: childrenLoading } = useActiveChild();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      queryClient.clear();
      toast.success('Sessão encerrada.');
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <Box sx={{ minHeight: '100%', pb: 14 }}>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(18px)' }}>
        <Toolbar disableGutters sx={{ minHeight: 76 }}>
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Box>
                <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2, fontWeight: 800 }}>
                  Diabete-IA
                </Typography>
                <Typography variant="h6" component="div" fontWeight={800} sx={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Navegação simplificada para o cuidado diário
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: { xs: 'auto', md: 320 }, justifyContent: 'flex-end' }}>
                {activeChild ? (
                  <Stack spacing={0.5} sx={{ minWidth: { xs: 140, sm: 220 } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
                      Perfil ativo
                    </Typography>
                    {childList.length > 1 ? (
                      <TextField
                        select
                        size="small"
                        value={activeChildId}
                        onChange={(event) => setActiveChildId(event.target.value)}
                        disabled={childrenLoading}
                        sx={{ minWidth: 220 }}
                      >
                        {childList.map((child) => (
                          <MenuItem key={child.id} value={child.id}>
                            {child.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Chip label={activeChild.name} color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
                    )}
                  </Stack>
                ) : null}
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  startIcon={<LogoutIcon fontSize="small" />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.55)' }}
                >
                  {logout.isPending ? 'Saindo...' : 'Sair'}
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3.5 } }}>
        {children}
      </Container>
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 16,
          px: 2,
          zIndex: 1100,
          pointerEvents: 'none',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 760,
            mx: 'auto',
            borderRadius: 999,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 20px 50px rgba(15,23,42,0.1)',
            pointerEvents: 'auto',
          }}
        >
          <BottomNavigation
            showLabels
            value={Math.max(
              0,
              navItems.findIndex((item) => location.pathname === item.to),
            )}
            sx={{ px: 0.75, py: 0.5 }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction key={item.to} label={item.label} icon={item.icon} component={Link} to={item.to} />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    </Box>
  );
}
