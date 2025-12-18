// ✅ CORRETO - src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // ✅ Verificar se tem token no localStorage (caso o state não esteja sincronizado)
  const hasToken = !!localStorage.getItem('eleve_token');

  // ✅ Se não está autenticado E não tem token, redirecionar
  if (!isAuthenticated && !hasToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;