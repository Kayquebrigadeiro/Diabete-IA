import { Navigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  const location = useLocation();
  const hasUser = Boolean(localStorage.getItem('access_token'));
  const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';

  if (!hasUser && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }
  if (hasUser && isPublicRoute) {
    return <Navigate to="/" replace />;
  }
  return <AppRoutes />;
}
