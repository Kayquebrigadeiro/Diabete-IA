import { Navigate, Route, Routes } from 'react-router-dom';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';
import DashboardView from '../views/DashboardView';
import ChildView from '../views/ChildView';
import MedicationsView from '../views/MedicationsView';
import SchedulesView from '../views/SchedulesView';
import AppointmentsView from '../views/AppointmentsView';
import ExamsView from '../views/ExamsView';
import GlucoseView from '../views/GlucoseView';
import LibraryView from '../views/LibraryView';
import AssistantView from '../views/AssistantView';
import NotificationsView from '../views/NotificationsView';
import SettingsView from '../views/SettingsView';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
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
  );
}

