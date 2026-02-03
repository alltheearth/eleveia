// src/pages/Campaigns/components/CampaignCard.tsx
// 🎴 CARD INDIVIDUAL DE CAMPANHA

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Play,
  Pause,
  Users,
  Calendar,
  TrendingUp,
} from 'lucide-react';

import {
  CAMPAIGN_TYPE_CONFIG,
  CAMPAIGN_STATUS_CONFIG,
  CHANNEL_CONFIG,
} from '../utils/campaignConfig';

import type { Campaign } from '../types/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignCardProps {
  campaign: Campaign;
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignCard({
  campaign,
  onView,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onDuplicate,
}: CampaignCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const typeConfig = CAMPAIGN_TYPE_CONFIG[campaign.type];
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];

  const canBePaused = ['sending', 'scheduled'].includes(campaign.status);
  const canBeResumed = campaign.status === 'paused';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${typeConfig.gradient} px-6 pt-6 pb-4`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{typeConfig.icon}</span>
              <span className={`px-3 py-1 ${typeConfig.bg} rounded-full text-xs font-bold ${typeConfig.text}`}>
                {typeConfig.label}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
              {campaign.name}
            </h3>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <MoreVertical className="text-white" size={18} />
            </button>

            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowActions(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
                >
                  <button
                    onClick={() => {
                      onView?.(campaign);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  >
                    <Eye size={16} />
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => {
                      onEdit?.(campaign);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate?.(campaign);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                  >
                    <Copy size={16} />
                    Duplicar
                  </button>

                  {canBePaused && (
                    <button
                      onClick={() => {
                        onPause?.(campaign);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-orange-50 text-orange-700 text-sm font-medium"
                    >
                      <Pause size={16} />
                      Pausar
                    </button>
                  )}

                  {canBeResumed && (
                    <button
                      onClick={() => {
                        onResume?.(campaign);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-green-50 text-green-700 text-sm font-medium"
                    >
                      <Play size={16} />
                      Retomar
                    </button>
                  )}

                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      onDelete?.(campaign);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-red-50 text-red-700 text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusConfig.color} rounded-full text-xs font-bold border`}>
            <span className={`w-2 h-2 ${statusConfig.dotColor} rounded-full animate-pulse`} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Descrição */}
        {campaign.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Público */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Público</p>
              <p className="text-sm font-bold text-gray-900">
                {campaign.audience_count.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {campaign.scheduled_at ? 'Agendado' : 'Criado'}
              </p>
              <p className="text-sm font-bold text-gray-900">
                {format(
                  new Date(campaign.scheduled_at || campaign.created_at),
                  'dd/MM/yy',
                  { locale: ptBR }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Canais de envio:</p>
          <div className="flex gap-2">
            {campaign.channels.map((channel) => {
              const channelConfig = CHANNEL_CONFIG[channel];
              return (
                <span
                  key={channel}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 ${channelConfig.bgColor} rounded-lg text-xs font-semibold ${channelConfig.color}`}
                >
                  {channelConfig.icon} {channelConfig.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Analytics (se disponível) */}
        {campaign.analytics && campaign.analytics.messages_sent > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.analytics.delivery_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">Entrega</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.analytics.open_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">Abertura</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {campaign.analytics.conversion_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500">Conversão</p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {campaign.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => onView?.(campaign)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-semibold"
        >
          <TrendingUp size={18} />
          Ver Analytics
        </button>
      </div>
    </motion.div>
  );
}