// src/pages/Campaigns/components/CampaignCard.tsx
// 💬 CARD DE CAMPANHA PROFISSIONAL

import { motion } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  MoreVertical,
  Calendar,
  Users,
  Send,
  Eye,
  MousePointerClick,
  TrendingUp,
  Pause,
  Play,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import type { Campaign, CampaignType, CampaignStatus } from '../../../types/campaigns/campaign.types';
import { CAMPAIGN_TYPE_CONFIG, CAMPAIGN_STATUS_CONFIG, CHANNEL_CONFIG } from '../../../types/campaigns/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onStatusChange?: (campaign: Campaign, newStatus: CampaignStatus) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onSend?: (campaign: Campaign) => void;
  variant?: 'default' | 'compact';
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onStatusChange,
  onPause,
  onResume,
  onSend,
  variant = 'default',
}: CampaignCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const typeConfig = CAMPAIGN_TYPE_CONFIG[campaign.type];
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ============================================
  // VARIANT: COMPACT
  // ============================================
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          {/* Avatar com gradiente */}
          <div className={`w-12 h-12 bg-gradient-to-br ${typeConfig.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
            {typeConfig.icon}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-gray-900 line-clamp-1">
                {campaign.name}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 ${statusConfig.color} whitespace-nowrap flex items-center gap-1`}>
                <span>{statusConfig.icon}</span>
              </span>
            </div>
            
            {campaign.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {campaign.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs">
              <span className={`px-2 py-0.5 rounded-full border ${typeConfig.border} ${typeConfig.bg} ${typeConfig.text} font-semibold flex items-center gap-1`}>
                <span>{typeConfig.icon}</span>
                {typeConfig.label}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <Users size={12} />
                {campaign.audience_count}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(campaign.created_at)}
              </span>
            </div>
          </div>

          {/* Ações */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(campaign);
              }}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 size={16} className="text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(campaign);
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Deletar"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // VARIANT: DEFAULT (Card completo)
  // ============================================

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${typeConfig.gradient} px-6 py-4 relative`}>
        <div className="flex items-start justify-between">
          {/* Tipo e Status */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/30">
              {typeConfig.icon}
            </div>
            <div>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                {typeConfig.label}
              </span>
              <div className="mt-1">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/30 flex items-center gap-1 w-fit">
                  <span>{statusConfig.icon}</span>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Menu de ações */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MoreVertical size={20} className="text-white" />
            </button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[180px]"
              >
                {/* Ações específicas por status */}
                {campaign.status === 'draft' && onSend && (
                  <button
                    onClick={() => {
                      onSend(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left"
                  >
                    <Send size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Enviar Agora</span>
                  </button>
                )}

                {campaign.status === 'sending' && onPause && (
                  <button
                    onClick={() => {
                      onPause(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                  >
                    <Pause size={16} className="text-orange-600" />
                    <span className="text-sm font-semibold text-orange-600">Pausar</span>
                  </button>
                )}

                {campaign.status === 'paused' && onResume && (
                  <button
                    onClick={() => {
                      onResume(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left"
                  >
                    <Play size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Retomar</span>
                  </button>
                )}

                <div className="h-px bg-gray-200 my-2" />

                <button
                  onClick={() => {
                    onEdit(campaign);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                >
                  <Edit2 size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(campaign);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 size={16} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Deletar</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Nome */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {campaign.name}
        </h3>

        {/* Descrição */}
        {campaign.description && (
          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Informações */}
        <div className="space-y-3 mb-4">
          {/* Audiência */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Público-Alvo</p>
              <p className="font-semibold">{campaign.audience_count} pessoas</p>
            </div>
          </div>

          {/* Canais */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Send size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Canais</p>
              <div className="flex gap-1 flex-wrap">
                {campaign.channels.map(channel => {
                  const config = CHANNEL_CONFIG[channel];
                  return (
                    <span
                      key={channel}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.color}`}
                    >
                      {config.icon} {config.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics (se disponível) */}
        {campaign.analytics && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <CheckCircle2 size={12} />
                <span>Entregues</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {campaign.analytics.delivery_rate.toFixed(0)}%
              </p>
            </div>
            <div className="text-center border-x border-gray-300">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <Eye size={12} />
                <span>Abertura</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {campaign.analytics.open_rate.toFixed(0)}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <MousePointerClick size={12} />
                <span>Conversão</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {campaign.analytics.conversion_rate.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Criada em {formatDate(campaign.created_at)}</span>
          </div>
          
          {campaign.scheduled_at && (
            <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
              <Calendar size={12} />
              <span>Agendada: {formatDate(campaign.scheduled_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}