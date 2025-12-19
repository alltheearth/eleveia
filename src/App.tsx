// src/App.tsx - ✅ CORRIGIDO
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { useGetProfileQuery } from './services';
import type { RootState } from './store';

function App() {
  const { token, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  console.log('🚀 [APP] Inicializando App:', {
    hasToken: !!token,
    isAuthenticated,
    hasUser: !!user,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'NENHUM'
  });

  // ✅ Buscar perfil SOMENTE se tiver token
  const { 
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError
  } = useGetProfileQuery(undefined, {
    skip: !token, // ✅ Só busca se tiver token
  });

  useEffect(() => {
    console.log('🔄 [APP] Estado de autenticação:', {
      token: token ? 'Existe' : 'Não existe',
      isAuthenticated,
      isLoadingProfile,
      hasProfile: !!profile,
      hasError: !!profileError
    });
  }, [token, isAuthenticated, isLoadingProfile, profile, profileError]);

  useEffect(() => {
    if (profile) {
      console.log('✅ [APP] Perfil carregado:', profile);
    }
  }, [profile]);

  useEffect(() => {
    if (profileError) {
      console.error('❌ [APP] Erro ao buscar perfil:', profileError);
    }
  }, [profileError]);

  // ✅ Mostrar loading enquanto busca perfil (apenas se tiver token)
  if (token && isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;