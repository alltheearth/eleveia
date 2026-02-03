// src/pages/Campaigns/components/CampaignAnalytics/TimelineChart.tsx

import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';
import type { TimelineDataPoint } from '../../types/campaign.types';

interface TimelineChartProps {
  timeline: TimelineDataPoint[];
  dateRange: '7d' | '30d' | 'all';
}

export default function TimelineChart({
  timeline,
  dateRange,
}: TimelineChartProps) {
  // Filter timeline based on date range
  const filterTimeline = () => {
    const now = new Date();
    const cutoffDate = new Date();

    if (dateRange === '7d') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (dateRange === '30d') {
      cutoffDate.setDate(now.getDate() - 30);
    } else {
      return timeline;
    }

    return timeline.filter(
      (point) => new Date(point.timestamp) >= cutoffDate
    );
  };

  const filteredTimeline = filterTimeline();

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...filteredTimeline.map((p) =>
      Math.max(p.sent, p.delivered, p.opened, p.clicked)
    ),
    1
  );

  // Calculate totals
  const totals = filteredTimeline.reduce(
    (acc, point) => ({
      sent: acc.sent + point.sent,
      delivered: acc.delivered + point.delivered,
      opened: acc.opened + point.opened,
      clicked: acc.clicked + point.clicked,
    }),
    { sent: 0, delivered: 0, opened: 0, clicked: 0 }
  );

  const metrics = [
    { label: 'Enviadas', value: totals.sent, color: 'bg-blue-500' },
    { label: 'Entregues', value: totals.delivered, color: 'bg-green-500' },
    { label: 'Abertas', value: totals.opened, color: 'bg-purple-500' },
    { label: 'Clicadas', value: totals.clicked, color: 'bg-orange-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">Timeline de Atividade</h3>
            <p className="text-indigo-100 text-sm">
              {filteredTimeline.length} pontos de dados
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        {filteredTimeline.length > 0 ? (
          <>
            {/* Chart visualization */}
            <div className="mb-6">
              <div className="relative h-64 flex items-end justify-between gap-1">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>{maxValue.toLocaleString('pt-BR')}</span>
                  <span>{(maxValue * 0.75).toFixed(0)}</span>
                  <span>{(maxValue * 0.5).toFixed(0)}</span>
                  <span>{(maxValue * 0.25).toFixed(0)}</span>
                  <span>0</span>
                </div>

                {/* Chart bars */}
                <div className="flex-1 ml-12 h-full flex items-end justify-between gap-1">
                  {filteredTimeline.map((point, index) => {
                    const height = (point.delivered / maxValue) * 100;
                    const openedHeight = (point.opened / maxValue) * 100;
                    const clickedHeight = (point.clicked / maxValue) * 100;

                    return (
                      <motion.div
                        key={point.timestamp}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.02,
                          ease: 'easeOut',
                        }}
                        className="flex-1 max-w-[40px] relative group origin-bottom"
                        style={{ height: `${height}%` }}
                      >
                        {/* Stacked bars */}
                        <div className="absolute inset-x-0 bottom-0 flex flex-col">
                          {/* Delivered */}
                          <div
                            className="bg-green-500 hover:bg-green-600 transition-colors rounded-t"
                            style={{ height: `${(point.delivered / point.delivered) * 100}%` }}
                          />
                          {/* Opened overlay */}
                          <div
                            className="absolute inset-x-0 bottom-0 bg-purple-500/50"
                            style={{ height: `${openedHeight}%` }}
                          />
                          {/* Clicked overlay */}
                          <div
                            className="absolute inset-x-0 bottom-0 bg-orange-500/70"
                            style={{ height: `${clickedHeight}%` }}
                          />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                            <p className="font-semibold mb-1">
                              {new Date(point.timestamp).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <p>Enviadas: {point.sent}</p>
                            <p>Entregues: {point.delivered}</p>
                            <p>Abertas: {point.opened}</p>
                            <p>Cliques: {point.clicked}</p>
                          </div>
                          <div className="w-2 h-2 bg-gray-900 transform rotate-45 -translate-y-1 mx-auto"></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis labels */}
              <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
                {filteredTimeline.length > 0 && (
                  <>
                    <span>
                      {new Date(filteredTimeline[0].timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <span>
                      {new Date(
                        filteredTimeline[filteredTimeline.length - 1].timestamp
                      ).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Legend & Totals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 ${metric.color} rounded`}></div>
                    <p className="text-xs text-gray-600 font-semibold">
                      {metric.label}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value.toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Trend indicator */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    Tendência de Crescimento
                  </p>
                  <p className="text-xs text-blue-700">
                    Baseado nos últimos {filteredTimeline.length} pontos de dados
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-semibold mb-1">
              Nenhum dado disponível
            </p>
            <p className="text-sm text-gray-500">
              Dados de timeline aparecerão aqui após o envio da campanha
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}