// src/pages/Calendar/components/EventStats.tsx
// 📊 ESTATÍSTICAS VISUAIS DE EVENTOS

import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface EventStatsProps {
  stats: {
    total: number;
    holiday: number;
    exam: number;
    graduation: number;
    cultural: number;
    upcoming: number;
    thisMonth: number;
  };
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'purple' | 'orange' | 'green';
  subtitle?: string;
}

// ============================================
// STAT CARD
// ============================================

const colorConfigs = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
  },
};

function StatCard({
  label,
  value,
  change,
  icon,
  color,
  subtitle,
}: StatCardProps) {
  const config = colorConfigs[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 ${config.light} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.light}`}>
              {isPositive ? (
                <ArrowUpRight size={14} className={config.text} />
              ) : (
                <ArrowDownRight size={14} className="text-red-600" />
              )}
              <span className={`text-xs font-bold ${isPositive ? config.text : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-5 py-4">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-4xl font-bold text-gray-900 mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EventStats({ stats, loading = false }: EventStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="bg-gray-200 h-24" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total de Eventos"
          value={stats.total}
          icon={<Calendar className="text-blue-600" size={24} />}
          color="blue"
          subtitle="Cadastrados no sistema"
        />

        <StatCard
          label="Próximos Eventos"
          value={stats.upcoming}
          change={12}
          icon={<TrendingUp className="text-green-600" size={24} />}
          color="green"
          subtitle="Nos próximos 30 dias"
        />

        <StatCard
          label="Este Mês"
          value={stats.thisMonth}
          icon={<Clock className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Eventos agendados"
        />

        <StatCard
          label="Tipos Diferentes"
          value={4}
          icon={<CheckCircle2 className="text-orange-600" size={24} />}
          color="orange"
          subtitle="Categorias ativas"
        />
      </div>

      {/* Stats por tipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Distribuição por Categoria
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Feriados */}
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              📌
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">{stats.holiday}</p>
            <p className="text-sm text-red-700 font-semibold">Feriados</p>
          </div>

          {/* Provas */}
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              📝
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.exam}</p>
            <p className="text-sm text-blue-700 font-semibold">Provas</p>
          </div>

          {/* Formaturas */}
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              🎓
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">{stats.graduation}</p>
            <p className="text-sm text-purple-700 font-semibold">Formaturas</p>
          </div>

          {/* Culturais */}
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              🎭
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">{stats.cultural}</p>
            <p className="text-sm text-orange-700 font-semibold">Culturais</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}