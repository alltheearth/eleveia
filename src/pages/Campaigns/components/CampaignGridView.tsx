// src/pages/Campaigns/components/CampaignListView.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Pause, 
  Play,
  Copy,
  Calendar,
  Users,
  Inbox
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Campaign } from '../../../types/campaigns/campaign.types';
import { CAMPAIGN_TYPE_CONFIG, CAMPAIGN_STATUS_CONFIG, CHANNEL_CONFIG } from '../config/campaign.config';

interface CampaignListViewProps {
  campaigns: Campaign[];
  onView?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
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
          <div className="flex items-center gap-3">
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
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      {/* Data */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400" size={16} />
          <span className="text-sm text-gray-900">
            {format(
              new Date(campaign.scheduled_at || campaign.created_at),
              'dd/MM/yy',
              { locale: ptBR }
            )}
          </span>
        </div>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors"
          >
            <MoreVertical className="text-gray-600" size={18} />
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
                  <Edit size={16} />
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
                
                {campaign.status === 'sending' && (
                  <button
                    onClick={() => {
                      onPause?.(campaign);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-orange-50 text-orange-600 text-sm font-medium"
                  >
                    <Pause size={16} />
                    Pausar
                  </button>
                )}

                {campaign.status === 'paused' && (
                  <button
                    onClick={() => {
                      onResume?.(campaign);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-green-50 text-green-600 text-sm font-medium"
                  >
                    <Play size={16} />
                    Retomar
                  </button>
                )}

                <div className="my-2 border-t border-gray-200" />
                
                <button
                  onClick={() => {
                    onDelete?.(campaign);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-red-50 text-red-600 text-sm font-medium"
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

export default function CampaignListView({
  campaigns,
  onView,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onDuplicate,
}: CampaignListViewProps) {
  if (campaigns.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Inbox className="text-gray-400" size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nenhuma campanha encontrada
        </h3>
        <p className="text-gray-600 mb-6">
          Não há campanhas que correspondam aos seus filtros atuais.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Criar Nova Campanha
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Campanha
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Canais
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Público
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
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