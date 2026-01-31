// src/pages/Dashboard/DashboardMobile.tsx
// 📱 DASHBOARD OTIMIZADO PARA MOBILE

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Users, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  Search,
  ChevronRight,
  ArrowUpRight,
  Home,
  FileText,
  MessageSquare
} from 'lucide-react';

// ============================================
// MOBILE HEADER
// ============================================
export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header fixo no topo */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
            
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">Escola ABC</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="mt-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Menu lateral */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl"
            >
              {/* Header do menu */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">ELEVE.IA</h2>
                      <p className="text-xs text-gray-500">Gestão Escolar</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Menu items */}
              <nav className="p-4 space-y-2">
                {[
                  { icon: Home, label: 'Dashboard', path: '/dashboard' },
                  { icon: Users, label: 'Leads', path: '/leads' },
                  { icon: FileText, label: 'Contatos', path: '/contacts' },
                  { icon: Calendar, label: 'Eventos', path: '/events' },
                  { icon: MessageSquare, label: 'Mensagens', path: '/messages' },
                ].map((item, index) => (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <item.icon size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// MOBILE METRIC CARD (Mais compacto)
// ============================================
interface MobileMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

export function MobileMetricCard({
  title,
  value,
  change,
  icon,
  color,
  onClick,
}: MobileMetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full ${color} rounded-2xl p-4 text-left shadow-sm active:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
          {icon}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            isPositive 
              ? 'bg-white/30 text-white' 
              : 'bg-red-500/30 text-red-900'
          }`}>
            <ArrowUpRight size={12} />
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">
        {title}
      </p>
      <p className="text-white text-3xl font-bold">
        {value}
      </p>
    </motion.button>
  );
}

// ============================================
// MOBILE QUICK ACTION BUTTONS
// ============================================
export function MobileQuickActions() {
  const actions = [
    {
      icon: Users,
      label: 'Novo Lead',
      color: 'bg-blue-500',
      onClick: () => console.log('Novo Lead'),
    },
    {
      icon: Calendar,
      label: 'Agendar',
      color: 'bg-purple-500',
      onClick: () => console.log('Agendar'),
    },
    {
      icon: MessageSquare,
      label: 'Mensagem',
      color: 'bg-green-500',
      onClick: () => console.log('Mensagem'),
    },
    {
      icon: FileText,
      label: 'Relatório',
      color: 'bg-orange-500',
      onClick: () => console.log('Relatório'),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm active:shadow-md transition-shadow"
        >
          <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
            <action.icon size={20} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// ============================================
// MOBILE ACTIVITY ITEM (Lista compacta)
// ============================================
interface MobileActivityProps {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

export function MobileActivityItem({
  title,
  description,
  time,
  icon,
  color,
}: MobileActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 p-4 bg-white rounded-xl shadow-sm"
    >
      <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 mb-1">
          {title}
        </p>
        <p className="text-xs text-gray-600 mb-1">
          {description}
        </p>
        <p className="text-xs text-gray-500">
          {time}
        </p>
      </div>

      <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
    </motion.div>
  );
}

// ============================================
// MOBILE BOTTOM NAV
// ============================================
export function MobileBottomNav() {
  const [active, setActive] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'leads', icon: Users, label: 'Leads' },
    { id: 'calendar', icon: Calendar, label: 'Agenda' },
    { id: 'messages', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
              active === item.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon 
              size={24} 
              className={active === item.id ? 'fill-blue-100' : ''}
            />
            <span className="text-xs font-semibold">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MOBILE DASHBOARD LAYOUT EXAMPLE
// ============================================
export default function DashboardMobile() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <MobileHeader />

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-3">
          <MobileMetricCard
            title="Leads"
            value="245"
            change={12}
            icon={<Users className="text-white" size={24} />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          
          <MobileMetricCard
            title="Conversões"
            value="89"
            change={8}
            icon={<TrendingUp className="text-white" size={24} />}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
        </div>

        {/* Ações rápidas */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Ações Rápidas</h2>
          <MobileQuickActions />
        </div>

        {/* Atividades recentes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Recentes</h2>
            <button className="text-sm text-blue-600 font-semibold">
              Ver todas
            </button>
          </div>
          
          <div className="space-y-3">
            <MobileActivityItem
              title="Novo Lead"
              description="Maria Silva via WhatsApp"
              time="há 5 min"
              icon={<Users size={20} className="text-blue-600" />}
              color="bg-blue-50"
            />
            
            <MobileActivityItem
              title="Conversão"
              description="João Santos confirmou"
              time="há 1h"
              icon={<TrendingUp size={20} className="text-green-600" />}
              color="bg-green-50"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}