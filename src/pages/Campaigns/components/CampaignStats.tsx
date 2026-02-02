// src/pages/Campaigns/components/CampaignStats.tsx
// 📊 ESTATÍSTICAS VISUAIS DE CAMPANHAS - DESIGN PROFISSIONAL

import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointerClick,
  Target,
  Zap
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface CampaignStatsProps {
  stats: {
    total: number;
    draft: number;
    scheduled: number;
    sending: number;
    completed: number;
    failed: number;
    avg_delivery_rate: number;
    avg_open_rate: number;
    avg_click_rate: number;
    avg_conversion_rate: number;
    sent_today: number;
    active_campaigns: number;
  };
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';
  subtitle?: string;
  percentage?: boolean;
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
  green: {
    gradient: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  yellow: {
    gradient: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
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
  percentage = false,
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
          {percentage ? `${value}%` : value}
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

export default function CampaignStats({ stats, loading = false }: CampaignStatsProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 mb-6">
      
      {/* Stats principais - Overview de campanhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total de Campanhas"
          value={stats.total}
          icon={<Send className="text-blue-600" size={24} />}
          color="blue"
          subtitle="Criadas no sistema"
        />

        <StatCard
          label="Concluídas"
          value={stats.completed}
          change={12}
          icon={<CheckCircle2 className="text-green-600" size={24} />}
          color="green"
          subtitle="Envios finalizados"
        />

        <StatCard
          label="Em Andamento"
          value={stats.active_campaigns}
          icon={<Zap className="text-orange-600" size={24} />}
          color="orange"
          subtitle="Ativas no momento"
        />

        <StatCard
          label="Agendadas"
          value={stats.scheduled}
          icon={<Clock className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Aguardando envio"
        />
      </div>

      {/* Performance metrics detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Taxa de Entrega */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full">
              <ArrowUpRight size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-600">+3%</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Taxa de Entrega Média
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.avg_delivery_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            Mensagens entregues com sucesso
          </p>

          {/* Barra de progresso */}
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_delivery_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600 shadow-md"
            />
          </div>
        </motion.div>

        {/* Taxa de Abertura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full">
              <ArrowUpRight size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-600">+5%</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Taxa de Abertura Média
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.avg_open_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            Mensagens abertas pelos destinatários
          </p>

          {/* Barra de progresso */}
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_open_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
            />
          </div>
        </motion.div>

        {/* Taxa de Clique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MousePointerClick className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 rounded-full">
              <ArrowUpRight size={14} className="text-purple-600" />
              <span className="text-xs font-bold text-purple-600">+8%</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Taxa de Clique Média
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.avg_click_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            Links clicados pelos destinatários
          </p>

          {/* Barra de progresso */}
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_click_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-md"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats adicionais - Conversão e atividade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target className="text-orange-600" size={20} />
              Performance Geral
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Métricas consolidadas de todas as campanhas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Taxa de Conversão */}
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              🎯
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">
              {stats.avg_conversion_rate.toFixed(1)}%
            </p>
            <p className="text-sm text-orange-700 font-semibold">Taxa de Conversão</p>
          </div>

          {/* Enviadas Hoje */}
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              📤
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{stats.sent_today}</p>
            <p className="text-sm text-blue-700 font-semibold">Enviadas Hoje</p>
          </div>

          {/* Rascunhos */}
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              📝
            </div>
            <p className="text-3xl font-bold text-gray-600 mb-1">{stats.draft}</p>
            <p className="text-sm text-gray-700 font-semibold">Rascunhos</p>
          </div>

          {/* Falhas */}
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              ⚠️
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">{stats.failed}</p>
            <p className="text-sm text-red-700 font-semibold">Falhas</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}