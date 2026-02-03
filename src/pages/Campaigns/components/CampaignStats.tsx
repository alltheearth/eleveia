// src/pages/Campaigns/components/CampaignStats.tsx
// 📊 ESTATÍSTICAS DE CAMPANHAS

import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointerClick,
  Clock,
  Pause,
  FileEdit,
} from 'lucide-react';

import type { CampaignStats } from '../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignStatsProps {
  stats: CampaignStats;
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'gray';
  subtitle?: string;
  percentage?: boolean;
}

// ============================================
// COLOR CONFIG
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
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
  },
  yellow: {
    gradient: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
  gray: {
    gradient: 'from-gray-500 to-gray-600',
    light: 'bg-gray-50',
    text: 'text-gray-600',
  },
};

// ============================================
// STAT CARD
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
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(8)].map((_, i) => (
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
    <div className="space-y-6 mb-6">
      {/* Stats principais - Linha 1 */}
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
          value={stats.sending}
          icon={<TrendingUp className="text-orange-600" size={24} />}
          color="orange"
          subtitle="Sendo enviadas agora"
        />

        <StatCard
          label="Agendadas"
          value={stats.scheduled}
          icon={<Clock className="text-purple-600" size={24} />}
          color="purple"
          subtitle="Aguardando envio"
        />
      </div>

      {/* Stats secundárias - Linha 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Rascunhos"
          value={stats.draft}
          icon={<FileEdit className="text-gray-600" size={24} />}
          color="gray"
          subtitle="Em edição"
        />

        <StatCard
          label="Pausadas"
          value={stats.paused}
          icon={<Pause className="text-yellow-600" size={24} />}
          color="yellow"
          subtitle="Temporariamente suspensas"
        />

        <StatCard
          label="Canceladas"
          value={stats.cancelled}
          icon={<XCircle className="text-red-600" size={24} />}
          color="red"
          subtitle="Não enviadas"
        />

        <StatCard
          label="Com Erro"
          value={stats.failed}
          icon={<XCircle className="text-red-600" size={24} />}
          color="red"
          subtitle="Falharam no envio"
        />
      </div>

      {/* Performance metrics - Linha 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_delivery_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600"
            />
          </div>
        </motion.div>

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

          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_open_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
        </motion.div>

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
            Taxa de Cliques Média
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.avg_click_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            Cliques em links das mensagens
          </p>

          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_click_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 rounded-full">
              <ArrowUpRight size={14} className="text-orange-600" />
              <span className="text-xs font-bold text-orange-600">+12%</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
            Taxa de Conversão Média
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {stats.avg_conversion_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            Ações completadas com sucesso
          </p>

          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.avg_conversion_rate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}