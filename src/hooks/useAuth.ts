// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useGetProfileQuery,
} from '../services';

/**
 * Hook customizado para gerenciar autenticação
 * 
 * @example
 * ```tsx
 * function LoginPage() {
 *   const { login, isLoading, user } = useAuth();
 *   
 *   const handleLogin = async () => {
 *     try {
 *       await login({ username: 'user', password: 'pass' });
 *     } catch (error) {
 *       console.error('Erro:', error);
 *     }
 *   };
 * }
 * ```
 */
export function useAuth() {
  // Estado do Redux
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Mutations do RTK Query
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  
  // Query de perfil (só executa se estiver autenticado)
  const { 
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  // Informações derivadas
  const isGestor = user?.perfil?.tipo === 'gestor';
  const isOperador = user?.perfil?.tipo === 'operador';
  const isSuperuser = user?.is_superuser || false;
  const escolaId = user?.perfil?.escola;
  const escolaNome = user?.perfil?.escola_nome;
  
  return {
    // Estado
    user: user || profile,
    token,
    isAuthenticated,
    
    // Permissões
    isGestor,
    isOperador,
    isSuperuser,
    escolaId,
    escolaNome,
    
    // Ações
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    refetchProfile,
    
    // Loading states
    isLoading: isLoggingIn || isRegistering || isLoggingOut || isLoadingProfile,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    isLoadingProfile,
  };
}