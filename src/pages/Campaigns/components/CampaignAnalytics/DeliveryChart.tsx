// src/pages/Campaigns/components/CampaignAnalytics/DeliveryChart.tsx

import { motion } from 'framer-motion';
import { Send, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { CampaignAnalytics, CampaignChannel } from '../../types/campaign.types';

interface DeliveryChartProps {
  analytics: CampaignAnalytics;
  selectedChannel: 'all' | CampaignChannel;
}

export default function DeliveryChart({
  analytics,
  selectedChannel,
}: DeliveryChartProps) {
  // Get channel-specific or all metrics
  const getMetrics = () => {
    if (selectedChannel === 'all') {
      return {
        sent: analytics.messages_sent,
        delivered: analytics.messages_delivered,
        failed: analytics.messages_failed,
      };
    }
    const channelMetrics = analytics.by_channel?.[selectedChannel];
    return {
      sent: channelMetrics?.sent || 0,
      delivered: channelMetrics?.delivered || 0,
      failed: channelMetrics?.failed || 0,
    };
  };

  const metrics = getMetrics();
  const pending = metrics.sent - metrics.delivered - metrics.failed;

  const deliveredPercentage = metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0;
  const failedPercentage = metrics.sent > 0 ? (metrics.failed / metrics.sent) * 100 : 0;
  const pendingPercentage = metrics.sent > 0 ? (pending / metrics.sent) * 100 : 0;

  const chartData = [
    {
      label: 'Entregues',
      value: metrics.delivered,
      percentage: deliveredPercentage,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-700',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
    },
    {
      label: 'Falhas',
      value: metrics.failed,
      percentage: failedPercentage,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-700',
      icon: <XCircle size={20} className="text-red-600" />,
    },
    {
      label: 'Pendentes',
      value: pending,
      percentage: pendingPercentage,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      icon: <Clock size={20} className="text-yellow-600" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Send className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">Status de Entrega</h3>
            <p className="text-blue-100 text-sm">
              {metrics.sent.toLocaleString('pt-BR')} mensagens enviadas
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 space-y-6">
        {/* Donut chart visualization */}
        <div className="relative">
          {/* Progress bars */}
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-semibold text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {item.value.toLocaleString('pt-BR')}
                    </span>
                    <span className={`text-xs font-semibold ${item.textColor}`}>
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {chartData.map((item) => (
            <div
              key={item.label}
              className={`${item.lightColor} rounded-xl p-4 border-2 border-gray-100`}
            >
              <p className="text-xs text-gray-600 font-semibold mb-1">
                {item.label}
              </p>
              <p className={`text-2xl font-bold ${item.textColor}`}>
                {item.percentage.toFixed(0)}%
              </p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Análise de Entrega
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                {deliveredPercentage >= 95 ? (
                  <>
                    Excelente taxa de entrega! Suas mensagens estão chegando aos destinatários
                    com alta eficiência.
                  </>
                ) : deliveredPercentage >= 85 ? (
                  <>
                    Boa taxa de entrega. Considere verificar os contatos que falharam para
                    melhorar ainda mais.
                  </>
                ) : (
                  <>
                    Taxa de entrega abaixo do ideal. Revise a qualidade da sua lista de contatos
                    e remova números inválidos.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}