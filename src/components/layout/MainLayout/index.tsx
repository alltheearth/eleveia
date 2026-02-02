// src/components/layout/Sidebar/index.tsx - ✅ SOLUÇÃO DEFINITIVA
import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calendar,
  BookOpen,
  FileText,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Sparkles,
  X,
} from 'lucide-react';
import { useCurrentSchool } from '../../../hooks/useCurrentSchool';
import { useSidebar } from '../../../hooks/useSidebar';

// ============================================
// TYPES
// ============================================

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  gradient?: string;
}

// ============================================
// MENU ITEMS
// ============================================

const MENU_ITEMS: MenuItem[] = [
  { 
    icon: Home, 
    label: 'Dashboard', 
    path: '/dashboard',
    gradient: 'from-blue-500 to-indigo-600',
  },
  { 
    icon: Users, 
    label: 'Leads', 
    path: '/leads',
    gradient: 'from-purple-500 to-pink-600',
  },
  { 
    icon: MessageSquare, 
    label: 'Contatos', 
    path: '/contatos',
    gradient: 'from-green-500 to-emerald-600',
  },
  { 
    icon: Calendar, 
    label: 'Calendário', 
    path: '/eventos',
    gradient: 'from-orange-500 to-red-600',
  },
  { 
    icon: HelpCircle, 
    label: 'FAQs', 
    path: '/faqs',
    gradient: 'from-cyan-500 to-blue-600',
  },
  { 
    icon: FileText, 
    label: 'Documentos', 
    path: '/documentos',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    label: 'Boards',
    icon: BookOpen,
    path: '/boards',
    gradient: 'from-amber-500 to-yellow-600',
  }
];

// ============================================
// SIDEBAR COMPONENT
// ============================================

export default function Sidebar() {
  const location = useLocation();
  const { currentSchool } = useCurrentSchool();
  const { isCollapsed, isMobileOpen, toggleCollapse, setMobileOpen } = useSidebar();

  const schoolName = currentSchool?.school_name || 'Carregando...';
  const schoolId = currentSchool?.id;

  // Fechar sidebar mobile ao mudar de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  // Fechar sidebar mobile ao clicar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, setMobileOpen]);

  return (
    <>
      {/* ============================================
          OVERLAY MOBILE (quando sidebar está aberto)
      ============================================ */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ============================================
          SIDEBAR
          
          MOBILE: Controlado por transform translateX
          DESKTOP: Sempre visível, apenas muda width
      ============================================ */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 bottom-0 
          bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 
          text-white shadow-2xl z-40 flex flex-col
          
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          
          lg:translate-x-0
          
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* ============================================
            HEADER / LOGO
        ============================================ */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                {/* Logo com gradiente */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-110 transition-transform">
                  <Sparkles className="text-white" size={24} />
                </div>
                
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    ELEVE.IA
                  </h1>
                  <p className="text-xs text-gray-400 font-medium">
                    Gestão Escolar
                  </p>
                </div>
              </div>
            )}

            {/* Botões de controle */}
            <div className="flex items-center gap-2">
              {/* Botão fechar (apenas mobile) */}
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} className="text-gray-400" />
              </button>

              {/* Toggle collapse (apenas desktop) */}
              <button
                onClick={toggleCollapse}
                className={`hidden lg:block p-2 hover:bg-white/10 rounded-lg transition-all ${
                  isCollapsed ? 'mx-auto' : ''
                }`}
                title={isCollapsed ? 'Expandir' : 'Recolher'}
              >
                {isCollapsed ? (
                  <ChevronRight size={20} className="text-gray-400" />
                ) : (
                  <ChevronLeft size={20} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================
            NAVIGATION MENU
        ============================================ */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-2">
            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="block"
                >
                  <div
                    className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} shadow-lg shadow-blue-500/20`
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    } transition-colors`}>
                      <Icon size={22} />
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <span className={`font-semibold text-sm ${
                        isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      } transition-colors`}>
                        {item.label}
                      </span>
                    )}

                    {/* Badge */}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                    )}

                    {/* Tooltip para collapsed (apenas desktop) */}
                    {isCollapsed && (
                      <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
                      </div>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ============================================
            FOOTER - SCHOOL INFO
        ============================================ */}
        <div className="p-4 border-t border-gray-800/50">
          
          {/* Settings Link */}
          <NavLink to="/configuracoes">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-3 transition-all hover:scale-[1.02] ${
                location.pathname === '/configuracoes'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg'
                  : 'hover:bg-white/5'
              }`}
            >
              <Settings size={20} className="text-gray-400" />
              {!isCollapsed && (
                <span className="font-semibold text-sm text-gray-300">
                  Configurações
                </span>
              )}
            </div>
          </NavLink>

          {/* School Info Card */}
          {!isCollapsed && (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Building2 size={20} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium mb-1">
                    Escola Atual
                  </p>
                  <p 
                    className="text-sm font-bold text-white truncate" 
                    title={schoolName}
                  >
                    {schoolName}
                  </p>
                  {schoolId && (
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {schoolId}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-400">Status</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold">Online</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-400">Plano</p>
                  <p className="text-white font-semibold mt-1">Pro</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed School Indicator */}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group cursor-pointer relative">
                <Building2 size={20} className="text-white" />
                
                {/* Tooltip */}
                <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {schoolName}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}