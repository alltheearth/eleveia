// src/components/layout/Header/index.tsx - ✅ SOLUÇÃO FINAL
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User, Building2, ChevronDown } from 'lucide-react';
import { useLogoutMutation, useGetProfileQuery } from '../../../services';
import type { RootState } from '../../../store';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { user: userFromState, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  
  // ✅ SOLUÇÃO: Só buscar perfil se estiver autenticado E tiver token
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = profile || userFromState;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMostrarMenu(false);
      }
    };

    if (mostrarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarMenu]);

  // ✅ Debug
  useEffect(() => {
    if (user) {
      console.log('👤 [HEADER] User:', user.username);
      console.log('🏫 [HEADER] Perfil:', user.perfil ? user.perfil.escola_nome : 'Sem perfil');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      console.log('✅ Logout bem-sucedido');
      navigate('/login');
    } catch (err) {
      console.error('❌ Erro no logout:', err);
      navigate('/login');
    }
  };

  const nomeCompleto = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.username || 'Usuário';

  const primeiroNome = user?.first_name || user?.username?.split('.')[0] || 'Usuário';
  const tipoPerfil = user?.perfil?.tipo_display || 'Usuário';
  const escolaNome = user?.perfil?.escola_nome || 'Sem escola';
  const escolaId = user?.perfil?.escola;

  const iniciais = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : (user?.username?.[0]?.toUpperCase() || 'U');

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Bem-vindo, {primeiroNome}! 👋
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <Building2 size={16} className="text-gray-500" />
          <p className="text-sm text-gray-600">{escolaNome}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative transition" title="Notificações">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-8 w-px bg-gray-300"></div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {iniciais}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">{nomeCompleto}</p>
              <p className="text-xs text-gray-500">{tipoPerfil}</p>
            </div>

            <ChevronDown size={16} className={`text-gray-500 transition-transform ${mostrarMenu ? 'rotate-180' : ''}`} />
          </button>

          {mostrarMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{nomeCompleto}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.email || 'Sem email'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {tipoPerfil}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={14} className="text-gray-500" />
                  <p className="text-xs text-gray-500 font-medium">Escola</p>
                </div>
                <p className="text-sm text-gray-900 font-semibold">{escolaNome}</p>
                {escolaId && <p className="text-xs text-gray-500 mt-1">ID: {escolaId}</p>}
              </div>

              <div className="px-2 py-2">
                <button
                  onClick={() => {
                    setMostrarMenu(false);
                    navigate('/configuracoes');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left"
                >
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm text-gray-700">Meu Perfil</span>
                </button>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition text-left disabled:opacity-50"
                >
                  <LogOut size={16} className="text-red-600" />
                  <span className="text-sm text-red-600 font-medium">
                    {isLoggingOut ? 'Saindo...' : 'Sair'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;