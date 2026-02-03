// src/pages/Campaigns/components/CampaignAnalytics/EngagementChart.tsx

import { motion } from 'framer-motion';
import { TrendingUp, Eye, MousePointerClick, MessageSquare } from 'lucide-react';
import type { CampaignAnalytics, CampaignChannel } from '../../types/campaign.types';

interface EngagementChartProps {
  analytics: CampaignAnalytics;
  selectedChannel: 'all' | CampaignChannel;
}

export default function EngagementChart({
  analytics,
  selectedChannel,
}: EngagementChartProps) {
  // Get channel-specific or all metrics
  const getMetrics = () => {
    if (selectedChannel === 'all') {
      return {
        delivered: analytics.messages_delivered,
        opened: analytics.messages_opened,
        clicked: analytics.messages_clicked,
        responded: analytics.messages_responded,
      };
    }
    const channelMetrics = analytics.by_channel?.[selectedChannel];
    return {
      delivered: channelMetrics?.delivered || 0,
      opened: channelMetrics?.opened || 0,
      clicked: channelMetrics?.clicked || 0,
      responded: channelMetrics?.responded || 0,
    };
  };

  const metrics = getMetrics();

  const openRate = metrics.delivered > 0 ? (metrics.opened / metrics.delivered) * 100 : 0;
  const clickRate = metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0;
  const responseRate = metrics.opened > 0 ? (metrics.responded / metrics.opened) * 100 : 0;

  const engagementData = [
    {
      label: 'Aberturas',
      value: metrics.opened,
      total: metrics.delivered,
      rate: openRate,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: <Eye size={20} className="text-blue-600" />,
      benchmark: 20, // Benchmark de mercado
    },
    {
      label: 'Cliques',
      value: metrics.clicked,
      total: metrics.opened,
      rate: clickRate,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: <MousePointerClick size={20} className="text-orange-600" />,
      benchmark: 15,
    },
    {
      label: 'Respostas',
      value: metrics.responded,
      total: metrics.opened,
      rate: responseRate,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: <MessageSquare size={20} className="text-purple-600" />,
      benchmark: 10,
    },
  ];

  // Calculate overall engagement score
  const engagementScore = ((openRate + clickRate + responseRate) / 3).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Engajamento</h3>
              <p className="text-purple-100 text-sm">
                Performance de interação
              </p>
            </div>
          </div>

          {/* Engagement score */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <p className="text-xs font-semibold text-purple-100 mb-0.5">Score</p>
            <p className="text-2xl font-bold text-white">{engagementScore}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 space-y-6">
        {/* Funnel visualization */}
        <div className="space-y-4">
          {engagementData.map((item, index) => {
            const isBelowBenchmark = item.rate < item.benchmark;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                className={`${item.lightColor} border-2 ${item.borderColor} rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.lightColor} rounded-lg flex items-center justify-center border-2 ${item.borderColor}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-600">
                        {item.value.toLocaleString('pt-BR')} de {item.total.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-3xl font-bold ${item.textColor}`}>
                      {item.rate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Meta: {item.benchmark}%
                    </p>
                  </div>
                </div>

                {/* Progress bar with benchmark */}
                <div className="relative">
                  <div className="h-4 bg-white rounded-full overflow-hidden border-2 border-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.rate, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
                      className={`h-full ${item.color}`}
                    />
                  </div>

                  {/* Benchmark indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                    style={{ left: `${item.benchmark}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="mt-2 flex items-center gap-2">
                  {isBelowBenchmark ? (
                    <>
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-orange-700 font-semibold">
                        Abaixo da meta
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-700 font-semibold">
                        Acima da meta
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-900 mb-1">
                Dicas de Engajamento
              </p>
              <p className="text-xs text-purple-700 leading-relaxed">
                {openRate < 20 ? (
                  <>
                    Sua taxa de abertura está baixa. Tente melhorar o assunto/primeira linha
                    da mensagem e envie em horários mais estratégicos.
                  </>
                ) : clickRate < 15 ? (
                  <>
                    Boas aberturas! Para aumentar os cliques, inclua CTAs mais claros e
                    destaque os benefícios de clicar.
                  </>
                ) : (
                  <>
                    Excelente engajamento! Continue com esta estratégia e teste variações
                    para otimizar ainda mais.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison with averages */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Média do setor</p>
            <p className="text-lg font-bold text-gray-900">18-25%</p>
            <p className="text-xs text-gray-500">Taxa de abertura</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Sua performance</p>
            <p className={`text-lg font-bold ${openRate >= 20 ? 'text-green-600' : 'text-orange-600'}`}>
              {openRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Taxa de abertura</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Diferença</p>
            <p className={`text-lg font-bold ${openRate >= 20 ? 'text-green-600' : 'text-orange-600'}`}>
              {openRate >= 20 ? '+' : ''}{(openRate - 21.5).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">vs. média</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}