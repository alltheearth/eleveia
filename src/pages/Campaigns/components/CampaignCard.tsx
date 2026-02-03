// src/pages/Campaigns/components/CampaignCard.tsx

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MessageSquare,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  BarChart3,
  Copy
} from 'lucide-react';
import { useState } from 'react';
import { 
  type Campaign, 
  CAMPAIGN_TYPE_CONFIG, 
  CAMPAIGN_STATUS_CONFIG 
} from '../../../types/campaigns/campaign.types';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onViewAnalytics?: (campaign: Campaign) => void;
}

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onDuplicate,
  onPause,
  onResume,
  onViewAnalytics,
}: CampaignCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Validação de segurança: se não houver type, use 'comunicado' como fallback
  const campaignType = campaign?.type || 'comunicado';
  const campaignStatus = campaign?.status || 'draft';
  
  const typeConfig = CAMPAIGN_TYPE_CONFIG[campaignType];
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaignStatus];

  if (!campaign) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header com gradiente */}
      <div className={`bg-gradient-to-r ${typeConfig.gradient} px-6 py-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${typeConfig.bg} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
              {typeConfig.icon}
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg line-clamp-1">{campaign.name}</h3>
              <p className="text-sm text-white/80">{typeConfig.label}</p>
            </div>
          </div>

          {/* Menu de ações */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <MoreVertical size={18} className="text-white" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
              >
                {onViewAnalytics && (
                  <button
                    onClick={() => {
                      onViewAnalytics(campaign);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <BarChart3 size={16} />
                    Ver Analytics
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(campaign);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                )}

                {onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate(campaign);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Duplicar
                  </button>
                )}

                {campaign.status === 'sending' && onPause && (
                  <button
                    onClick={() => {
                      onPause(campaign);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <Pause size={16} />
                    Pausar
                  </button>
                )}

                {campaign.status === 'paused' && onResume && (
                  <button
                    onClick={() => {
                      onResume(campaign);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                  >
                    <Play size={16} />
                    Retomar
                  </button>
                )}

                {onDelete && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        onDelete(campaign);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-5 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>

          <div className="flex items-center gap-2">
            {campaign.channels.map((channel) => (
              <span
                key={channel}
                className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700"
              >
                {channel === 'whatsapp' && '📱'}
                {channel === 'email' && '📧'}
                {channel === 'sms' && '💬'}
                {' '}
                {channel.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Descrição */}
        {campaign.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users size={16} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {campaign.audience_count || 0}
            </p>
            <p className="text-xs text-gray-500">Destinatários</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare size={16} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {campaign.analytics?.messages_sent || 0}
            </p>
            <p className="text-xs text-gray-500">Enviadas</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BarChart3 size={16} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {campaign.analytics?.open_rate?.toFixed(1) || 0}%
            </p>
            <p className="text-xs text-gray-500">Abertura</p>
          </div>
        </div>

        {/* Data de agendamento */}
        {campaign.scheduled_at && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Agendada: {formatDate(campaign.scheduled_at)} às {formatTime(campaign.scheduled_at)}
            </span>
          </div>
        )}

        {/* Tags */}
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            {campaign.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer com progresso (se estiver enviando) */}
      {campaign.status === 'sending' && campaign.analytics && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">
              Progresso de Envio
            </span>
            <span className="text-xs font-bold text-gray-900">
              {campaign.analytics.messages_sent} / {campaign.analytics.total_recipients}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(campaign.analytics.messages_sent / campaign.analytics.total_recipients) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
              className={`h-full bg-gradient-to-r ${typeConfig.gradient}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}