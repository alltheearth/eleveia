// src/pages/Leads/components/LeadStats.tsx
// 📊 ESTATÍSTICAS VISUAIS DE LEADS - PROFISSIONAL

import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Phone,
  UserCheck
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
  color: 'blue' | 'yellow' | 'purple' | 'green' | 'red' | 'gray';
  subtitle?: string;
  percentage?: number;
}

// ============================================
// COLOR CONFIG
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
  gray: {
    gradient: 'from-gray-500 to-gray-600',
    light: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
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
        
        {/* Barra de progresso (se houver percentage) */}
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
  const pctNovo = totalAtivos > 0 ? ((stats.novo / totalAtivos) * 100).toFixed(0) : 0;
  const pctContato = totalAtivos > 0 ? ((stats.contato / totalAtivos) * 100).toFixed(0) : 0;
  const pctQualificado = totalAtivos > 0 ? ((stats.qualificado / totalAtivos) * 100).toFixed(0) : 0;
  const pctConversao = totalAtivos > 0 ? ((stats.conversao / totalAtivos) * 100).toFixed(0) : 0;

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
          percentage={Number(pctNovo)}
        />

        <StatCard
          label="Em Contato"
          value={stats.contato}
          change={8}
          icon={<Phone className="text-yellow-600" size={24} />}
          color="yellow"
          subtitle="Sendo trabalhados"
          percentage={Number(pctContato)}
        />

        <StatCard
          label="Qualificados"
          value={stats.qualificado}
          change={12}
          icon={<UserCheck className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Prontos para conversão"
          percentage={Number(pctQualificado)}
        />

        <StatCard
          label="Convertidos"
          value={stats.conversao}
          change={20}
          icon={<CheckCircle2 className="text-green-600" size={24} />}
          color="green"
          subtitle="Matrículas confirmadas"
          percentage={Number(pctConversao)}
        />
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Taxa de Conversão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Target className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 font-semibold uppercase tracking-wider">
                Taxa de Conversão
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold mb-1">{stats.taxa_conversao}%</p>
              <p className="text-sm text-white/80">
                {stats.conversao} de {stats.total} leads
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full">
              <TrendingUp size={16} />
              <span className="text-sm font-bold">+5%</span>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.taxa_conversao}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white shadow-lg"
            />
          </div>
        </motion.div>

        {/* Novos Hoje */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Clock className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 font-semibold uppercase tracking-wider">
                Novos Hoje
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold mb-1">{stats.novos_hoje}</p>
              <p className="text-sm text-white/80">
                Captados nas últimas 24h
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full">
              <ArrowUpRight size={16} />
              <span className="text-sm font-bold">+3</span>
            </div>
          </div>

          {/* Mini chart visual */}
          <div className="mt-4 flex items-end gap-1 h-12">
            {[40, 60, 45, 80, 55, 75, 90].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-1 bg-white/30 rounded-t"
              />
            ))}
          </div>
        </motion.div>

        {/* Leads Perdidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <Users className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 font-semibold uppercase tracking-wider">
                Leads Perdidos
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold mb-1">{stats.perdido}</p>
              <p className="text-sm text-white/80">
                {((stats.perdido / stats.total) * 100).toFixed(1)}% do total
              </p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full">
              <ArrowDownRight size={16} />
              <span className="text-sm font-bold">-2%</span>
            </div>
          </div>

          {/* Indicador visual */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-white/80">Meta: &lt;15%</span>
            <span className="text-xs font-bold">
              {((stats.perdido / stats.total) * 100).toFixed(1)}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Funil Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Funil de Conversão</h3>
            <p className="text-sm text-gray-500 mt-1">Pipeline de leads ativo</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Ativo</p>
            <p className="text-2xl font-bold text-gray-900">{totalAtivos}</p>
          </div>
        </div>

        {/* Funil visual */}
        <div className="space-y-3">
          {[
            { label: 'Novos', value: stats.novo, color: 'bg-blue-500', width: 100 },
            { label: 'Em Contato', value: stats.contato, color: 'bg-yellow-500', width: 75 },
            { label: 'Qualificados', value: stats.qualificado, color: 'bg-purple-500', width: 50 },
            { label: 'Convertidos', value: stats.conversao, color: 'bg-green-500', width: 30 },
          ].map((stage, index) => (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                <span className="text-sm font-bold text-gray-900">{stage.value}</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.width}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-10 ${stage.color} rounded-lg flex items-center justify-end px-4 shadow-md`}
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