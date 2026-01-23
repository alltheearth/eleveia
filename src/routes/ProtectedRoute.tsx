// src/routes/ProtectedRoute.tsx - ✅ CORRIGIDO
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // ✅ Debug
  useEffect(() => {
    console.log('🔒 [PROTECTED ROUTE] Verificando autenticação...');
    console.log('📋 Estado:', { isAuthenticated, hasToken: !!token });
  }, [isAuthenticated, token]);

  // ✅ Verificar localStorage como fallback
  const hasToken = !!localStorage.getItem('eleve_token');

  // ✅ Se não está autenticado E não tem token, redirecionar
  if (!isAuthenticated && !hasToken && !token) {
    console.log('❌ [PROTECTED ROUTE] Usuário não autenticado, redirecionando para /login');
    return <Navigate to={redirectTo} replace />;
  }

  console.log('✅ [PROTECTED ROUTE] Usuário autenticado, renderizando conteúdo protegido');
  return <Outlet />;
};

export default ProtectedRoute;