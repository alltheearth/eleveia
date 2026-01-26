// src/components/layout/Sidebar/index.tsx - ✅ VERSÃO CORRIGIDA
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  BookOpen,
  FileText,
  Users,
} from 'lucide-react';
import { useCurrentSchool } from '../../../hooks/useCurrentSchool';

const Sidebar = () => {
  // ✅ Buscar escola atual (CORRIGIDO)
  const { currentSchool } = useCurrentSchool();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Calendário', path: '/eventos' },
    { icon: BookOpen, label: 'FAQs', path: '/faqs' },
    { icon: FileText, label: 'Documentos', path: '/documentos' },
    { icon: Users, label: 'Leads', path: '/leads' },
  ];

  // ✅ CORRIGIDO: Usar school_name
  const schoolName = currentSchool?.school_name || 'Carregando...';

  console.log('🏫 [SIDEBAR] Escola:', {
    id: currentSchool?.id,
    name: schoolName,
  });

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">EleveAI</h1>
        <p className="text-xs text-gray-400 truncate" title={schoolName}>
          {schoolName}
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

      {/* Footer - School Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-sm">
          <p className="font-medium text-gray-300 truncate" title={schoolName}>
            {schoolName}
          </p>
          {currentSchool && (
            <p className="text-xs text-gray-500">
              ID: {currentSchool.id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;