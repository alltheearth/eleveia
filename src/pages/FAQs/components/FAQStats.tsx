// src/pages/FAQs/components/FAQStats.tsx
// 📊 ESTATÍSTICAS VISUAIS DE FAQs

import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Tag
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface FAQStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
    recentlyUpdated: number;
  };
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
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
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
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

export default function FAQStats({ stats, loading = false }: FAQStatsProps) {
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

  // Top 3 categorias
  const topCategories = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total de FAQs"
          value={stats.total}
          icon={<HelpCircle className="text-blue-600" size={24} />}
          color="blue"
          subtitle="Cadastradas no sistema"
        />

        <StatCard
          label="FAQs Ativas"
          value={stats.active}
          change={12}
          icon={<CheckCircle2 className="text-green-600" size={24} />}
          color="green"
          subtitle="Visíveis publicamente"
        />

        <StatCard
          label="FAQs Inativas"
          value={stats.inactive}
          icon={<AlertCircle className="text-orange-600" size={24} />}
          color="orange"
          subtitle="Ocultas do público"
        />

        <StatCard
          label="Atualizadas Recentemente"
          value={stats.recentlyUpdated}
          icon={<TrendingUp className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Últimos 7 dias"
        />
      </div>

      {/* Distribuição por categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag className="text-purple-600" size={20} />
              Distribuição por Categoria
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {Object.keys(stats.byCategory).length} categorias ativas
            </p>
          </div>
        </div>

        {/* Top 3 Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCategories.map(([category, count], index) => {
            const colors = [
              { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
              { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
              { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
            ];
            const color = colors[index];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${color.border} ${color.bg} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    #{index + 1} Mais usada
                  </span>
                  <span className={`text-2xl font-bold ${color.text}`}>
                    {count}
                  </span>
                </div>
                <p className={`font-bold ${color.text}`}>
                  {category}
                </p>
                <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / stats.total) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full ${color.text.replace('text-', 'bg-')}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Todas as categorias */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(stats.byCategory)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm text-gray-700 font-medium truncate">
                    {category}
                  </span>
                  <span className="text-sm font-bold text-gray-900 ml-2">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}