import { Navigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  // Hackathon Bypass: Desativando bloqueio de autenticação para a apresentação
  return <AppRoutes />;
}
