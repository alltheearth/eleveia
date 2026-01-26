import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import {
  Home,
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Ticket,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    // { icon: UserPlus, label: 'Contatos', path: '/contatos' },
    { icon: Calendar, label: 'Calendário', path: '/eventos' },
    { icon: BookOpen, label: 'FAQs', path: '/faqs' },
    // { icon: Ticket, label: 'Tickets', path: '/tickets'},
    { icon: FileText, label: 'Documentos', path: '/documentos' },
    // { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
    // { icon: Settings, label: 'Configurações', path: '/configuracoes' },
    { icon: Users, label: 'Leads', path: '/leads' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">EleveAI</h1>
        <p className="text-xs text-gray-400">
          {user?.perfil?.escola_nome || 'Carregando...'}
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-sm">
          <p className="font-medium">{user?.first_name} {user?.last_name}</p>
          <p className="text-xs text-gray-400">
            {user?.perfil?.tipo_display || 'Usuário'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;