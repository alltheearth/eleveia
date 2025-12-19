// src/App.tsx - ✅ CORRIGIDO - SEM HOOK DENTRO DE HOOK
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { useGetProfileQuery } from './services';
import type { RootState } from './store';

function App() {
  // ✅ Todos os hooks devem estar no topo do componente
  const { token, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // ✅ Buscar perfil se estiver autenticado
  const { 
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  // ✅ DEBUG: Log inicial do estado de autenticação
  useEffect(() => {
    const tokenPreview = token ? token.substring(0, 15) + '...' : 'NENHUM';
    console.log('🚀 [APP] Inicializando App:', {
      hasToken: !!token,
      isAuthenticated,
      hasUser: !!user,
      tokenPreview
    });
  }, []); // Executa apenas uma vez

  // ✅ DEBUG: Log do estado de profile
  useEffect(() => {
    console.log('🔄 [APP] Estado de autenticação:', {
      token: token ? 'Existe' : 'Não existe',
      isAuthenticated,
      isLoadingProfile,
      hasProfile: !!profile,
      hasError: !!profileError
    });
  }, [token, isAuthenticated, isLoadingProfile, profile, profileError]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;