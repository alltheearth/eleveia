// src/components/layout/Header/UserDropdown/index.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Building2,
  Shield,
  X 
} from 'lucide-react';
import { useLogoutMutation } from '../../../../services';

interface UserDropdownProps {
  user: {
    fullName: string;
    initials: string;
    email: string;
  };
  profile: {
    roleDisplay: string;
    isActive: boolean;
  };
  school: {
    id: number;
    name: string;
  };
  isSuperuser?: boolean;
}

const UserDropdown = ({ user, profile, school, isSuperuser }: UserDropdownProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Erro no logout:', err);
      navigate('/login');
    }
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user.initials}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {user.fullName}
          </p>
          <p className="text-xs text-gray-500">
            {profile.roleDisplay}
          </p>
        </div>

        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {profile.roleDisplay}
                  </span>
                  {isSuperuser && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium flex items-center gap-1">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={14} className="text-gray-500" />
              <p className="text-xs text-gray-500 font-medium">Escola</p>
            </div>
            <p className="text-sm text-gray-900 font-semibold">
              {school.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ID: {school.id}
            </p>
          </div>

          <div className="px-2 py-2">
            <button
              onClick={() => handleNavigate('/configuracoes')}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <User size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Meu Perfil</span>
            </button>

            <button
              onClick={() => handleNavigate('/configuracoes')}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <Settings size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Configurações</span>
            </button>

            <div className="h-px bg-gray-200 my-2"></div>

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
  );
};

export default UserDropdown;