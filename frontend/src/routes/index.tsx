import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';

const LoginView = lazy(() => import('../views/LoginView'));
const RegisterView = lazy(() => import('../views/RegisterView'));
const DashboardView = lazy(() => import('../views/DashboardView'));
const ChildView = lazy(() => import('../views/ChildView'));
const MedicationsView = lazy(() => import('../views/MedicationsView'));
const SchedulesView = lazy(() => import('../views/SchedulesView'));
const AppointmentsView = lazy(() => import('../views/AppointmentsView'));
const ExamsView = lazy(() => import('../views/ExamsView'));
const GlucoseView = lazy(() => import('../views/GlucoseView'));
const LibraryView = lazy(() => import('../views/LibraryView'));
const AssistantView = lazy(() => import('../views/AssistantView'));
const NotificationsView = lazy(() => import('../views/NotificationsView'));
const SettingsView = lazy(() => import('../views/SettingsView'));
const OnboardingView = lazy(() => import('../views/OnboardingView'));

function RouteFallback() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" fontWeight={800}>
          Carregando a tela
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preparando os módulos necessários para esta etapa.
        </Typography>
      </Stack>
    </Box>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/onboarding" element={<OnboardingView />} />
        <Route path="/" element={<DashboardView />} />
        <Route path="/child" element={<ChildView />} />
        <Route path="/medications" element={<MedicationsView />} />
        <Route path="/schedules" element={<SchedulesView />} />
        <Route path="/appointments" element={<AppointmentsView />} />
        <Route path="/exams" element={<ExamsView />} />
        <Route path="/glucose" element={<GlucoseView />} />
        <Route path="/library" element={<LibraryView />} />
        <Route path="/assistant" element={<AssistantView />} />
        <Route path="/notifications" element={<NotificationsView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
