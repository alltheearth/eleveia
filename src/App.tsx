// ✅ CORRETO - src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import type { RootState } from './store';
import { useGetProfileQuery } from './services'; // ✅ Importar do services

function App() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // ✅ Buscar perfil automaticamente se estiver autenticado
  const { refetch } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated, // Só busca se estiver autenticado
  });

  // ✅ Verificar autenticação ao carregar
  useEffect(() => {
    const storedToken = localStorage.getItem('eleve_token');
    
    if (storedToken && isAuthenticated) {
      console.log('✅ Token encontrado, buscando perfil...');
      refetch();
    }
  }, [isAuthenticated, refetch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;