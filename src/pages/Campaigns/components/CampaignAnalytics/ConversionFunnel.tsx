// src/pages/Campaigns/components/CampaignAnalytics/ConversionFunnel.tsx

import { motion } from 'framer-motion';
import { Target, Users, Eye, MousePointerClick, CheckCircle2 } from 'lucide-react';
import type { CampaignAnalytics, CampaignChannel } from '../../types/campaign.types';

interface ConversionFunnelProps {
  analytics: CampaignAnalytics;
  selectedChannel: 'all' | CampaignChannel;
}

export default function ConversionFunnel({
  analytics,
  selectedChannel,
}: ConversionFunnelProps) {
  // Get channel-specific or all metrics
  const getMetrics = () => {
    if (selectedChannel === 'all') {
      return {
        recipients: analytics.total_recipients,
        delivered: analytics.messages_delivered,
        opened: analytics.messages_opened,
        clicked: analytics.messages_clicked,
        conversions: analytics.conversions,
      };
    }
    const channelMetrics = analytics.by_channel?.[selectedChannel];
    return {
      recipients: analytics.total_recipients,
      delivered: channelMetrics?.delivered || 0,
      opened: channelMetrics?.opened || 0,
      clicked: channelMetrics?.clicked || 0,
      conversions: 0, // Conversions only available for 'all'
    };
  };

  const metrics = getMetrics();

  const funnelSteps = [
    {
      label: 'Destinatários',
      value: metrics.recipients,
      percentage: 100,
      icon: <Users size={24} className="text-blue-600" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Entregues',
      value: metrics.delivered,
      percentage: (metrics.delivered / metrics.recipients) * 100,
      dropOff: metrics.recipients - metrics.delivered,
      icon: <CheckCircle2 size={24} className="text-green-600" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    {
      label: 'Abriram',
      value: metrics.opened,
      percentage: (metrics.opened / metrics.recipients) * 100,
      dropOff: metrics.delivered - metrics.opened,
      icon: <Eye size={24} className="text-purple-600" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Clicaram',
      value: metrics.clicked,
      percentage: (metrics.clicked / metrics.recipients) * 100,
      dropOff: metrics.opened - metrics.clicked,
      icon: <MousePointerClick size={24} className="text-orange-600" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Converteram',
      value: metrics.conversions,
      percentage: (metrics.conversions / metrics.recipients) * 100,
      dropOff: metrics.clicked - metrics.conversions,
      icon: <Target size={24} className="text-pink-600" />,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Target className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">Funil de Conversão</h3>
            <p className="text-pink-100 text-sm">
              Jornada completa do destinatário
            </p>
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="p-6 space-y-4">
        {funnelSteps.map((step, index) => {
          const isLast = index === funnelSteps.length - 1;
          const nextStep = !isLast ? funnelSteps[index + 1] : null;
          const conversionToNext = nextStep 
            ? ((nextStep.value / step.value) * 100).toFixed(1)
            : null;

          return (
            <div key={step.label}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Funnel step */}
                <div
                  className={`border-2 ${step.borderColor} rounded-xl overflow-hidden`}
                  style={{
                    width: `${Math.max(step.percentage, 20)}%`,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <div className={`bg-gradient-to-r ${step.color} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white">{step.label}</p>
                          <p className="text-sm text-white/90">
                            {step.value.toLocaleString('pt-BR')} pessoas
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {step.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-white/80">do total</p>
                      </div>
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  {step.dropOff !== undefined && step.dropOff > 0 && (
                    <div className={`${step.bgColor} px-6 py-2 border-t-2 ${step.borderColor}`}>
                      <p className={`text-xs font-semibold ${step.textColor}`}>
                        ⚠️ {step.dropOff.toLocaleString('pt-BR')} não avançaram para a próxima etapa
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector with conversion rate */}
              {!isLast && conversionToNext && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.1) + 0.05 }}
                  className="flex items-center justify-center py-2"
                >
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 border-2 border-gray-200">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-700">
                      {conversionToNext}% converteram
                    </span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wider">
                Taxa de Conversão Geral
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {analytics.conversion_rate.toFixed(2)}%
              </p>
            </div>

            <div>
              <p className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wider">
                Total de Conversões
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {metrics.conversions.toLocaleString('pt-BR')}
              </p>
            </div>

            <div>
              <p className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wider">
                Maior Drop-off
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {Math.max(
                  ...funnelSteps
                    .filter(s => s.dropOff !== undefined)
                    .map(s => ((s.dropOff || 0) / metrics.recipients) * 100)
                ).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  Análise do Funil
                </p>
                <p className="text-xs text-purple-700 leading-relaxed">
                  {analytics.conversion_rate >= 5 ? (
                    <>
                      Excelente taxa de conversão! Seu funil está bem otimizado. Continue
                      monitorando e testando pequenas variações para manter a performance.
                    </>
                  ) : analytics.conversion_rate >= 3 ? (
                    <>
                      Boa taxa de conversão. Para melhorar, foque em reduzir o maior drop-off
                      do funil e teste diferentes CTAs e mensagens.
                    </>
                  ) : (
                    <>
                      Taxa de conversão abaixo do ideal. Analise cada etapa do funil e
                      identifique onde está perdendo mais pessoas. Teste diferentes abordagens
                      e mensagens.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}