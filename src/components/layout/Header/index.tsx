// src/components/layout/Header/index.tsx - ✅ VERSÃO CORRIGIDA
import { Bell, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { useGetProfileQuery } from '../../../services';
import { useCurrentSchool } from '../../../hooks/useCurrentSchool';
import UserDropdown from './UserDropdown';
import HeaderSkeleton from './HeaderSkeleton';
import HeaderError from './HeaderError';

const Header = () => {
  const { user: userFromState, isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  // ✅ Buscar perfil do usuário
  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, error: errorProfile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  // ✅ Buscar escola atual (CORRIGIDO)
  const { currentSchool, isLoading: isLoadingSchool } = useCurrentSchool();

  const user = profile || userFromState;

  // ============================================
  // LOADING
  // ============================================
  if (isLoadingProfile || isLoadingSchool) {
    return <HeaderSkeleton />;
  }

  // ============================================
  // ERROR
  // ============================================
  if (isErrorProfile || !user) {
    return <HeaderError error={errorProfile} />;
  }

  // ============================================
  // DADOS FORMATADOS
  // ============================================
  const firstName = user.first_name || user.username?.split('.')[0] || 'Usuário';
  const fullName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.username || 'Usuário';

  const initials = user.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user.username?.[0]?.toUpperCase() || 'U';

  const roleDisplay = user.perfil?.tipo_display || 'Usuário';
  const isActive = user.perfil?.ativo || false;
  const isSuperuser = user.is_superuser || user.is_staff || false;

  // ✅ CORRIGIDO: Usar school_name
  const schoolName = currentSchool?.school_name || 'Carregando escola...';
  const schoolId = currentSchool?.id || 0;

  console.log('🏫 [HEADER] Escola atual:', {
    id: schoolId,
    name: schoolName,
    currentSchool
  });

  // ============================================
  // RENDER
  // ============================================
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      
      {/* ========== LADO ESQUERDO: Boas-vindas ========== */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Bem-vindo, {firstName}! 👋
        </h2>
        
        {currentSchool && (
          <div className="flex items-center gap-2 mt-1">
            <Building2 size={16} className="text-gray-500" />
            <p className="text-sm text-gray-600">{schoolName}</p>
          </div>
        )}
      </div>

      {/* ========== LADO DIREITO: Notificações + User ========== */}
      <div className="flex items-center gap-4">
        
        {/* Botão de Notificações */}
        <button 
          className="p-2 hover:bg-gray-100 rounded-full relative transition" 
          title="Notificações"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* User Dropdown */}
        <UserDropdown
          user={{
            fullName,
            initials,
            email: user.email,
          }}
          profile={{
            roleDisplay,
            isActive,
          }}
          school={{
            id: schoolId,
            name: schoolName,
          }}
          isSuperuser={isSuperuser}
        />
      </div>
    </header>
  );
};

export default Header;