import { Navigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  const location = useLocation();
  const hasUser = Boolean(localStorage.getItem('access_token'));
  if (!hasUser && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }
  return <AppRoutes />;
}
