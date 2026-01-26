// src/components/layout/Header/index.tsx
/**
 * ✅ HEADER REFATORADO E PROFISSIONAL
 * 
 * Melhorias implementadas:
 * 1. Hook customizado para gerenciar dados (useHeaderData)
 * 2. Componente UserDropdown separado
 * 3. Estados de loading e erro tratados adequadamente
 * 4. Código limpo e organizado
 * 5. Dados da escola exibidos corretamente
 * 6. Skeleton loading para melhor UX
 */

import { Bell, Building2 } from 'lucide-react';
import { useHeaderData } from '../../../hooks/useHeaderData';
import UserDropdown from './UserDropdown';
import HeaderSkeleton from './HeaderSkeleton';
import HeaderError from './HeaderError';

const Header = () => {
  // ============================================
  // 1. BUSCAR DADOS USANDO HOOK CUSTOMIZADO
  // ============================================
  
  const {
    user,
    profile,
    school,
    isLoading,
    isError,
    error,
    permissions,
  } = useHeaderData();

  // ============================================
  // 2. ESTADOS DE LOADING E ERRO
  // ============================================

  // Loading state
  if (isLoading) {
    return <HeaderSkeleton />;
  }

  // Error state
  if (isError || !user || !profile) {
    return <HeaderError error={error} />;
  }

  // ============================================
  // 3. DADOS FORMATADOS
  // ============================================

  const welcomeMessage = `Bem-vindo, ${user.firstName || user.username}!`;
  const schoolName = school?.name || 'Carregando escola...';

  // ============================================
  // 4. RENDER DO HEADER
  // ============================================

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      
      {/* ========== LADO ESQUERDO: Boas-vindas ========== */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          {welcomeMessage} 👋
        </h2>
        
        {school && (
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
          {/* Badge de notificações */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* User Dropdown */}
        <UserDropdown
          user={{
            fullName: user.fullName,
            initials: user.initials,
            email: user.email,
          }}
          profile={{
            roleDisplay: profile.roleDisplay,
            isActive: profile.isActive,
          }}
          school={{
            id: school?.id || 0,
            name: school?.name || 'N/A',
          }}
          isSuperuser={permissions.canManageUsers}
        />
      </div>
    </header>
  );
};

export default Header;