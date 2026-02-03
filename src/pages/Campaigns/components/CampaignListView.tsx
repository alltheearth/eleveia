// src/pages/Campaigns/components/CampaignListView.tsx
// 📋 VISUALIZAÇÃO EM LISTA

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  List,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Play,
  Pause,
  Users,
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

interface CampaignListViewProps {
  campaigns: Campaign[];
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  loading?: boolean;
}

function CampaignRow({
  campaign,
  onView,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onDuplicate,
}: {
  campaign: Campaign;
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  
  const typeConfig = CAMPAIGN_TYPE_CONFIG[campaign.type];
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];

  const canBePaused = ['sending', 'scheduled'].includes(campaign.status);
  const canBeResumed = campaign.status === 'paused';

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* Nome e Tipo */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${typeConfig.gradient} rounded-xl flex items-center justify-center text-lg shadow-sm`}>
            {typeConfig.icon}
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-0.5">
              {campaign.name}
            </p>
            <p className="text-xs text-gray-500">
              {typeConfig.label}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusConfig.color} rounded-full text-xs font-bold border`}>
          <span className={`w-2 h-2 ${statusConfig.dotColor} rounded-full animate-pulse`} />
          {statusConfig.label}
        </span>
      </td>

      {/* Canais */}
      <td className="px-6 py-4">
        <div className="flex gap-1.5">
          {campaign.channels.map((channel) => {
            const channelConfig = CHANNEL_CONFIG[channel];
            return (
              <span
                key={channel}
                className={`inline-flex items-center px-2 py-1 ${channelConfig.bgColor} rounded-md text-xs font-semibold ${channelConfig.color}`}
                title={channelConfig.label}
              >
                {channelConfig.icon}
              </span>
            );
          })}
        </div>
      </td>

      {/* Público */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Users className="text-gray-400" size={16} />
          <span className="text-sm font-semibold text-gray-900">
            {campaign.audience_count.toLocaleString()}
          </span>
        </div>
      </td>

      {/* Performance */}
      <td className="px-6 py-4">
        {campaign.analytics && campaign.analytics.messages_sent > 0 ? (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">
                {campaign.analytics.delivery_rate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">Entrega</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">
                {campaign.analytics.open_rate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">Abertura</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">
                {campaign.analytics.conversion_rate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">Conversão</p>
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Sem dados</span>
        )}
      </td>

      {/* Data */}
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {format(
              new Date(campaign.scheduled_at || campaign.created_at),
              'dd/MM/yyyy',
              { locale: ptBR }
            )}
          </p>
          <p className="text-xs text-gray-500">
            {campaign.scheduled_at ? 'Agendado' : 'Criado'}
          </p>
        </div>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-600" />
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
      </td>
    </motion.tr>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CampaignListView({
  campaigns,
  onView,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onDuplicate,
  loading = false,
}: CampaignListViewProps) {
  
  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Campanha
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Canais
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Público
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100 animate-pulse">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded-full w-24" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-6 w-8 bg-gray-200 rounded" />
                    <div className="h-6 w-8 bg-gray-200 rounded" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <div className="h-8 bg-gray-200 rounded w-12" />
                    <div className="h-8 bg-gray-200 rounded w-12" />
                    <div className="h-8 bg-gray-200 rounded w-12" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  
  if (campaigns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <List className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nenhuma campanha encontrada
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Não há campanhas cadastradas ou nenhuma campanha corresponde aos filtros selecionados.
        </p>
      </motion.div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Campanha
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Canais
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Público
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {campaigns.map((campaign) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPause={onPause}
                  onResume={onResume}
                  onDuplicate={onDuplicate}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}