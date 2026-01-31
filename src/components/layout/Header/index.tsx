// src/components/layout/Header/index.tsx - 🎨 VERSÃO PROFISSIONAL
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  HelpCircle,
  ChevronDown,
  Command,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ============================================
// USER MENU DROPDOWN
// ============================================

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserMenu({ isOpen, onClose }: UserMenuProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Meu Perfil', action: () => navigate('/perfil') },
    { icon: Settings, label: 'Configurações', action: () => navigate('/configuracoes') },
    { icon: HelpCircle, label: 'Ajuda & Suporte', action: () => window.open('https://help.eleve.ia', '_blank') },
    { icon: LogOut, label: 'Sair', action: () => navigate('/logout'), danger: true },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
      >
        {/* User Info */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="text-white" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900">João Silva</p>
              <p className="text-sm text-gray-600">joao@escola.com</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  item.danger 
                    ? 'hover:bg-red-50 text-red-600' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// NOTIFICATION CENTER
// ============================================

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const notifications = [
    {
      id: 1,
      title: 'Novo lead cadastrado',
      message: 'Maria Santos entrou em contato',
      time: '5 min atrás',
      unread: true,
      type: 'info',
    },
    {
      id: 2,
      title: 'Evento próximo',
      message: 'Reunião de pais amanhã às 14h',
      time: '1 hora atrás',
      unread: true,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Documento aprovado',
      message: 'Regimento interno foi aprovado',
      time: '2 horas atrás',
      unread: false,
      type: 'success',
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notificações</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Marcar todas como lidas
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                notif.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Indicator */}
                {notif.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {notif.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notif.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas as notificações
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// GLOBAL SEARCH
// ============================================

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');

  const suggestions = [
    { type: 'Página', icon: '📄', label: 'Dashboard', path: '/dashboard' },
    { type: 'Página', icon: '👥', label: 'Leads', path: '/leads' },
    { type: 'Página', icon: '📅', label: 'Calendário', path: '/eventos' },
    { type: 'Contato', icon: '👤', label: 'Maria Santos', path: '/contatos/1' },
    { type: 'Documento', icon: '📎', label: 'Regimento.pdf', path: '/documentos/1' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50"
      >
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Buscar em tudo... (Cmd+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 text-lg outline-none text-gray-900 placeholder:text-gray-400"
            />
            <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                // Navigate to item.path
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
              <span className="text-gray-400 text-sm">→</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑</kbd>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↓</kbd>
              <span>navegar</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↵</kbd>
              <span>selecionar</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Command size={12} />
            <span>+K para buscar</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Left Side - Search */}
        <div className="flex-1 max-w-xl">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left group"
          >
            <Search className="text-gray-400 group-hover:text-gray-600" size={20} />
            <span className="text-gray-500 group-hover:text-gray-700">
              Buscar em tudo...
            </span>
            <kbd className="ml-auto px-2 py-1 bg-white border border-gray-300 text-gray-600 text-xs rounded font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell size={22} className="text-gray-600" />
              {/* Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <NotificationCenter 
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="text-white" size={18} />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">João Silva</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <UserMenu 
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <GlobalSearch 
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}