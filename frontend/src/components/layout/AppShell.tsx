import { AppBar, Box, BottomNavigation, BottomNavigationAction, Container, Toolbar, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicationIcon from '@mui/icons-material/Medication';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
  { label: 'Medicamentos', icon: <MedicationIcon />, to: '/medications' },
  { label: 'Glicemia', icon: <ShowChartIcon />, to: '/glucose' },
  { label: 'Chat IA', icon: <SmartToyIcon />, to: '/assistant' },
  { label: 'Config', icon: <SettingsIcon />, to: '/settings' },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const location = useLocation();
  return (
    <Box sx={{ minHeight: '100%', pb: 10 }}>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(12px)' }}>
        <Toolbar>
          <Typography fontWeight={800}>{title}</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>{children}</Container>
      <BottomNavigation
        showLabels
        value={navItems.findIndex((item) => location.pathname === item.to)}
        sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, borderTop: '1px solid rgba(15,23,42,0.08)' }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction key={item.to} label={item.label} icon={item.icon} component={Link} to={item.to} />
        ))}
      </BottomNavigation>
    </Box>
  );
}
