// src/pages/Campaigns/components/CampaignListView.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Trash2, 
  Copy, 
  BarChart3,
  Eye,
  Edit,
  Calendar,
  Users,
  Send
} from 'lucide-react';
import { CAMPAIGN_TYPE_CONFIG, CAMPAIGN_STATUS_CONFIG, CHANNEL_CONFIG } from '../types/campaign.types';
import type { Campaign } from '../types/campaign.types';

interface CampaignListViewProps {
  campaigns: Campaign[];
  loading?: boolean;
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  onSend?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onViewAnalytics?: (campaign: Campaign) => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-white rounded-2xl"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
        <span className="text-5xl">📧</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Nenhuma campanha encontrada
      </h3>
      <p className="text-gray-600 mb-6">
        Comece criando sua primeira campanha de comunicação
      </p>
    </motion.div>
  );
}

export default function CampaignListView({
  campaigns,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onSend,
  onPause,
  onResume,
  onViewAnalytics,
}: CampaignListViewProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (campaigns.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {campaigns.map((campaign, index) => {
          const typeConfig = CAMPAIGN_TYPE_CONFIG[campaign.type];
          const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
          
          const canSend = campaign.status === 'draft' || campaign.status === 'scheduled';
          const canPause = campaign.status === 'sending';
          const canResume = campaign.status === 'paused';

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              layout
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${typeConfig.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}
                  >
                    {typeConfig.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {campaign.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${typeConfig.bg} ${typeConfig.text}`}>
                            {typeConfig.icon} {typeConfig.label}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusConfig.color}`}>
                            {statusConfig.icon} {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {campaign.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {campaign.description}
                      </p>
                    )}

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Destinatários</p>
                          <p className="font-bold text-gray-900">{campaign.audience_count.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Send size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Canais</p>
                          <div className="flex gap-1">
                            {campaign.channels.map(channel => (
                              <span key={channel} className="text-sm" title={CHANNEL_CONFIG[channel].label}>
                                {CHANNEL_CONFIG[channel].icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {campaign.analytics && (
                        <>
                          <div className="flex items-center gap-2">
                            <BarChart3 size={16} className="text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Taxa de Entrega</p>
                              <p className="font-bold text-green-600">{campaign.analytics.delivery_rate.toFixed(1)}%</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Eye size={16} className="text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Taxa de Abertura</p>
                              <p className="font-bold text-blue-600">{campaign.analytics.open_rate.toFixed(1)}%</p>
                            </div>
                          </div>
                        </>
                      )}

                      {campaign.scheduled_at && (
                        <div className="flex items-center gap-2 col-span-2">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Agendamento</p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(campaign.scheduled_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {campaign.tags.slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {campaign.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{campaign.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {canSend && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSend?.(campaign)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                        >
                          <Play size={16} />
                          Enviar
                        </motion.button>
                      )}

                      {canPause && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onPause?.(campaign)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors text-sm"
                        >
                          <Pause size={16} />
                          Pausar
                        </motion.button>
                      )}

                      {canResume && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onResume?.(campaign)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors text-sm"
                        >
                          <Play size={16} />
                          Retomar
                        </motion.button>
                      )}

                      <button
                        onClick={() => onViewAnalytics?.(campaign)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                      >
                        <BarChart3 size={16} />
                      </button>

                      <button
                        onClick={() => onEdit?.(campaign)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => onDuplicate?.(campaign)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        onClick={() => onDelete?.(campaign)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                Criada em {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                {campaign.updated_at !== campaign.created_at && (
                  <span> • Atualizada em {new Date(campaign.updated_at).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}