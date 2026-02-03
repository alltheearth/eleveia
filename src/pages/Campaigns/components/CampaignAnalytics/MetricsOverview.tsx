// src/pages/Campaigns/components/CampaignAnalytics/MetricsOverview.tsx

import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  XCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { CampaignAnalytics, CampaignChannel } from '../../types/campaign.types';

interface MetricsOverviewProps {
  analytics: CampaignAnalytics;
  selectedChannel: 'all' | CampaignChannel;
}

interface MetricCardProps {
  label: string;
  value: number | string;
  total?: number;
  percentage?: number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'yellow';
  format?: 'number' | 'percentage' | 'currency';
}

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
  red: {
    gradient: 'from-red-500 to-red-600',
    light: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
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
  yellow: {
    gradient: 'from-yellow-500 to-yellow-600',
    light: 'bg-yellow-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
  },
};

function MetricCard({
  label,
  value,
  total,
  percentage,
  change,
  icon,
  color,
  format = 'number',
}: MetricCardProps) {
  const config = colorConfigs[color];
  const isPositiveChange = change !== undefined && change >= 0;

  const formatValue = () => {
    if (format === 'percentage') {
      return `${value}%`;
    }
    if (format === 'currency') {
      return `R$ ${value}`;
    }
    return value.toLocaleString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm border-2 ${config.border} overflow-hidden`}
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${config.gradient} px-5 pt-5 pb-4`}>
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 ${config.light} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>

          {change !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.light}`}>
              {isPositiveChange ? (
                <ArrowUpRight size={14} className={config.text} />
              ) : (
                <ArrowDownRight size={14} className="text-red-600" />
              )}
              <span className={`text-xs font-bold ${isPositiveChange ? config.text : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>

        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-4xl font-bold text-gray-900">
            {formatValue()}
          </p>
          {total !== undefined && (
            <p className="text-lg text-gray-400 font-semibold">
              / {total.toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        {percentage !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="font-semibold">{percentage.toFixed(1)}%</span>
              <span>do total</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${config.gradient}`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MetricsOverview({
  analytics,
  selectedChannel,
}: MetricsOverviewProps) {
  // Get channel-specific or all metrics
  const getMetrics = () => {
    if (selectedChannel === 'all') {
      return analytics;
    }
    return analytics.by_channel?.[selectedChannel] || {
      sent: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0,
      responded: 0,
    };
  };

  const metrics = getMetrics();
  const totalSent = selectedChannel === 'all' ? analytics.messages_sent : metrics.sent;
  const totalDelivered = selectedChannel === 'all' ? analytics.messages_delivered : metrics.delivered;
  const totalFailed = selectedChannel === 'all' ? analytics.messages_failed : metrics.failed;
  const totalOpened = selectedChannel === 'all' ? analytics.messages_opened : metrics.opened;
  const totalClicked = selectedChannel === 'all' ? analytics.messages_clicked : metrics.clicked;
  const totalConversions = selectedChannel === 'all' ? analytics.conversions : 0;

  return (
    <div className="space-y-6">
      {/* Primary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total de Destinatários"
          value={analytics.total_recipients}
          icon={<Users className="text-blue-600" size={24} />}
          color="blue"
        />

        <MetricCard
          label="Mensagens Enviadas"
          value={totalSent}
          total={analytics.total_recipients}
          percentage={(totalSent / analytics.total_recipients) * 100}
          icon={<Send className="text-purple-600" size={24} />}
          color="purple"
        />

        <MetricCard
          label="Mensagens Entregues"
          value={totalDelivered}
          total={totalSent}
          percentage={totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0}
          change={3.5}
          icon={<CheckCircle2 className="text-green-600" size={24} />}
          color="green"
        />

        <MetricCard
          label="Falhas no Envio"
          value={totalFailed}
          total={totalSent}
          percentage={totalSent > 0 ? (totalFailed / totalSent) * 100 : 0}
          change={-1.2}
          icon={<XCircle className="text-red-600" size={24} />}
          color="red"
        />
      </div>

      {/* Engagement metrics */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-purple-600" />
          Métricas de Engajamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Taxa de Entrega"
            value={analytics.delivery_rate.toFixed(1)}
            icon={<CheckCircle2 className="text-green-600" size={24} />}
            color="green"
            format="percentage"
          />

          <MetricCard
            label="Taxa de Abertura"
            value={analytics.open_rate.toFixed(1)}
            change={5.2}
            icon={<Eye className="text-blue-600" size={24} />}
            color="blue"
            format="percentage"
          />

          <MetricCard
            label="Taxa de Cliques"
            value={analytics.click_rate.toFixed(1)}
            change={2.8}
            icon={<MousePointerClick className="text-orange-600" size={24} />}
            color="orange"
            format="percentage"
          />

          <MetricCard
            label="Taxa de Conversão"
            value={analytics.conversion_rate.toFixed(1)}
            change={8.5}
            icon={<Target className="text-purple-600" size={24} />}
            color="purple"
            format="percentage"
          />
        </div>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-purple-900 mb-2">
              📊 Resumo da Performance
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-purple-600 font-semibold mb-1">Aberturas</p>
                <p className="text-2xl font-bold text-purple-900">{totalOpened}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 font-semibold mb-1">Cliques</p>
                <p className="text-2xl font-bold text-purple-900">{totalClicked}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 font-semibold mb-1">Respostas</p>
                <p className="text-2xl font-bold text-purple-900">
                  {selectedChannel === 'all' ? analytics.messages_responded : metrics.responded}
                </p>
              </div>
              <div>
                <p className="text-xs text-purple-600 font-semibold mb-1">Conversões</p>
                <p className="text-2xl font-bold text-purple-900">{totalConversions}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl items-center justify-center shadow-lg">
            <TrendingUp className="text-white" size={48} />
          </div>
        </div>

        {/* Performance indicator */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-700">
              Performance Geral
            </span>
            <div className="flex items-center gap-2">
              {analytics.delivery_rate >= 95 && analytics.open_rate >= 20 && analytics.conversion_rate >= 5 ? (
                <>
                  <span className="text-sm font-bold text-green-600">Excelente</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </>
              ) : analytics.delivery_rate >= 85 && analytics.open_rate >= 15 ? (
                <>
                  <span className="text-sm font-bold text-blue-600">Boa</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold text-orange-600">Regular</span>
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}