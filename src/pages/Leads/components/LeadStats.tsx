// src/pages/Leads/components/LeadStats.tsx
// 📊 ESTATÍSTICAS VISUAIS DE LEADS - DESIGN ATUALIZADO

import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Phone,
  UserCheck,
  XCircle,
  Sparkles
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface LeadStatsProps {
  stats: {
    total: number;
    novo: number;
    contato: number;
    qualificado: number;
    conversao: number;
    perdido: number;
    taxa_conversao: number;
    novos_hoje: number;
  };
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'purple' | 'green' | 'red';
  subtitle?: string;
  percentage?: number;
}

// ============================================
// COLOR CONFIG (Seguindo padrão do projeto)
// ============================================

const colorConfigs = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  yellow: {
    gradient: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
};

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  label,
  value,
  change,
  icon,
  color,
  subtitle,
  percentage,
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
        
        {/* Barra de progresso */}
        {percentage !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Do total</span>
              <span className="text-xs font-bold text-gray-700">{percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.gradient}`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function LeadStats({ stats, loading = false }: LeadStatsProps) {
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

  // Calcular percentuais
  const totalAtivos = stats.total - stats.perdido;
  const pctNovo = totalAtivos > 0 ? Number(((stats.novo / totalAtivos) * 100).toFixed(0)) : 0;
  const pctContato = totalAtivos > 0 ? Number(((stats.contato / totalAtivos) * 100).toFixed(0)) : 0;
  const pctQualificado = totalAtivos > 0 ? Number(((stats.qualificado / totalAtivos) * 100).toFixed(0)) : 0;
  const pctConversao = totalAtivos > 0 ? Number(((stats.conversao / totalAtivos) * 100).toFixed(0)) : 0;

  return (
    <div className="space-y-6">
      {/* Stats principais - Funil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Novos Leads"
          value={stats.novo}
          change={15}
          icon={<Users className="text-blue-600" size={24} />}
          color="blue"
          subtitle="Aguardando primeiro contato"
          percentage={pctNovo}
        />

        <StatCard
          label="Em Contato"
          value={stats.contato}
          change={8}
          icon={<Phone className="text-yellow-600" size={24} />}
          color="yellow"
          subtitle="Sendo trabalhados"
          percentage={pctContato}
        />

        <StatCard
          label="Qualificados"
          value={stats.qualificado}
          change={12}
          icon={<UserCheck className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Prontos para conversão"
          percentage={pctQualificado}
        />

        <StatCard
          label="Convertidos"
          value={stats.conversao}
          change={20}
          icon={<CheckCircle2 className="text-green-600" size={24} />}
          color="green"
          subtitle="Matrículas confirmadas"
          percentage={pctConversao}
        />
      </div>

      {/* Cards de Performance (Seguindo padrão do Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Taxa de Conversão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full">
              <ArrowUpRight size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-600">+5%</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Taxa de Conversão
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.taxa_conversao}%
          </p>
          <p className="text-xs text-gray-500">
            {stats.conversao} de {stats.total} leads
          </p>

          {/* Barra de progresso */}
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.taxa_conversao}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600 shadow-md"
            />
          </div>
        </motion.div>

        {/* Novos Hoje */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full">
              <ArrowUpRight size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-600">+3</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Novos Hoje
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.novos_hoje}
          </p>
          <p className="text-xs text-gray-500">
            Captados nas últimas 24h
          </p>

          {/* Mini chart visual */}
          <div className="mt-4 flex items-end gap-1 h-12">
            {[40, 60, 45, 80, 55, 75, 90].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
              />
            ))}
          </div>
        </motion.div>

        {/* Leads Perdidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <XCircle className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-full">
              <ArrowDownRight size={14} className="text-red-600" />
              <span className="text-xs font-bold text-red-600">-2%</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Leads Perdidos
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.perdido}
          </p>
          <p className="text-xs text-gray-500">
            {((stats.perdido / stats.total) * 100).toFixed(1)}% do total
          </p>

          {/* Indicador visual */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-500">Meta: &lt;15%</span>
            <span className={`font-bold ${
              (stats.perdido / stats.total) * 100 < 15 ? 'text-green-600' : 'text-red-600'
            }`}>
              {((stats.perdido / stats.total) * 100).toFixed(1)}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Funil Visual (Seguindo padrão das outras páginas) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Funil de Conversão
            </h3>
            <p className="text-sm text-gray-500 mt-1">Pipeline de leads ativo</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-semibold">Total Ativo</p>
            <p className="text-2xl font-bold text-gray-900">{totalAtivos}</p>
          </div>
        </div>

        {/* Funil visual */}
        <div className="space-y-3">
          {[
            { label: 'Novos', value: stats.novo, color: 'from-blue-500 to-blue-600', width: 100, icon: '🆕' },
            { label: 'Em Contato', value: stats.contato, color: 'from-yellow-500 to-yellow-600', width: 75, icon: '📞' },
            { label: 'Qualificados', value: stats.qualificado, color: 'from-purple-500 to-purple-600', width: 50, icon: '⭐' },
            { label: 'Convertidos', value: stats.conversao, color: 'from-green-500 to-green-600', width: 30, icon: '✅' },
          ].map((stage, index) => (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-lg">{stage.icon}</span>
                  {stage.label}
                </span>
                <span className="text-sm font-bold text-gray-900">{stage.value}</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.width}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-10 bg-gradient-to-r ${stage.color} rounded-xl flex items-center justify-end px-4 shadow-md`}
              >
                <span className="text-white font-bold">
                  {totalAtivos > 0 ? ((stage.value / totalAtivos) * 100).toFixed(0) : 0}%
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}