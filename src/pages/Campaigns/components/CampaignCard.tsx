// src/pages/Campaigns/components/CampaignCard.tsx
// 📊 CARD DE CAMPANHA PROFISSIONAL - DESIGN MODERNO

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
  Target,
  Play,
  Pause,
  Copy,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';
import type { Campaign, CampaignType, CampaignStatus } from '../../../types/campaigns/campaign.types';

// ============================================
// TYPES
// ============================================

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onViewAnalytics?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
  onSend?: (campaign: Campaign) => void;
  variant?: 'default' | 'compact';
}

// ============================================
// TYPE & STATUS CONFIG (Seguindo padrão do projeto)
// ============================================

const CAMPAIGN_TYPE_CONFIG: Record<CampaignType, {
  label: string;
  gradient: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  matricula: {
    label: 'Matrícula',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '🎓',
  },
  rematricula: {
    label: 'Rematrícula',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '🔄',
  },
  passei_direto: {
    label: 'Passei Direto',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: '🎉',
  },
  reuniao: {
    label: 'Reunião',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: '📅',
  },
  evento: {
    label: 'Evento',
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    icon: '🎊',
  },
  cobranca: {
    label: 'Cobrança',
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: '💰',
  },
  comunicado: {
    label: 'Comunicado',
    gradient: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '📢',
  },
};

const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  draft: {
    label: 'Rascunho',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: '📝',
  },
  scheduled: {
    label: 'Agendada',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: '⏰',
  },
  sending: {
    label: 'Enviando',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: '🚀',
  },
  sent: {
    label: 'Enviada',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '✅',
  },
  completed: {
    label: 'Concluída',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '✅',
  },
  paused: {
    label: 'Pausada',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: '⏸️',
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: '🚫',
  },
  failed: {
    label: 'Falhou',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: '❌',
  },
};

const CHANNEL_ICONS = {
  whatsapp: '💬',
  email: '📧',
  sms: '📱',
};

// ============================================
// COMPONENT
// ============================================

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onViewAnalytics,
  onDuplicate,
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
          {/* Ícone do tipo */}
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
            
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {campaign.audience_count} contatos
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(campaign.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full border ${typeConfig.border} ${typeConfig.bg} ${typeConfig.text} font-semibold text-xs`}>
                {typeConfig.label}
              </span>
              <div className="flex items-center gap-1">
                {campaign.channels.map(channel => (
                  <span key={channel} className="text-sm">
                    {CHANNEL_ICONS[channel]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {onViewAnalytics && ['sent', 'completed'].includes(campaign.status) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewAnalytics(campaign);
                }}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                title="Ver Analytics"
              >
                <BarChart3 size={16} className="text-purple-600" />
              </button>
            )}
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
                {/* Analytics */}
                {onViewAnalytics && ['sent', 'completed'].includes(campaign.status) && (
                  <button
                    onClick={() => {
                      onViewAnalytics(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors text-left"
                  >
                    <BarChart3 size={16} className="text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">Ver Analytics</span>
                  </button>
                )}

                {/* Send (se draft ou scheduled) */}
                {onSend && ['draft', 'scheduled'].includes(campaign.status) && (
                  <button
                    onClick={() => {
                      onSend(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left"
                  >
                    <Send size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Enviar Agora</span>
                  </button>
                )}

                {/* Pause/Resume */}
                {onPause && campaign.status === 'sending' && (
                  <button
                    onClick={() => {
                      onPause(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                  >
                    <Pause size={16} className="text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">Pausar</span>
                  </button>
                )}

                {onResume && campaign.status === 'paused' && (
                  <button
                    onClick={() => {
                      onResume(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left"
                  >
                    <Play size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Retomar</span>
                  </button>
                )}

                {/* Duplicate */}
                {onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate(campaign);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                  >
                    <Copy size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Duplicar</span>
                  </button>
                )}

                <div className="h-px bg-gray-200 my-2" />

                {/* Edit */}
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

                {/* Delete */}
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
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {campaign.name}
        </h3>

        {/* Descrição */}
        {campaign.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
            {campaign.description}
          </p>
        )}

        {/* Métricas rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users size={16} className="text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600">{campaign.audience_count}</p>
            <p className="text-xs text-blue-700 font-semibold">Contatos</p>
          </div>

          {campaign.analytics && (
            <>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Eye size={16} className="text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-600">
                  {campaign.analytics.open_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-green-700 font-semibold">Abertura</p>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <MousePointerClick size={16} className="text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-600">
                  {campaign.analytics.click_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-purple-700 font-semibold">Cliques</p>
              </div>
            </>
          )}

          {!campaign.analytics && campaign.status === 'draft' && (
            <div className="col-span-2 text-center p-3 bg-gray-50 rounded-lg">
              <Target size={16} className="text-gray-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600 font-semibold">Sem dados ainda</p>
            </div>
          )}
        </div>

        {/* Canais */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-600 font-semibold">Canais:</span>
          <div className="flex items-center gap-1">
            {campaign.channels.map(channel => (
              <span 
                key={channel}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1"
              >
                <span>{CHANNEL_ICONS[channel]}</span>
                {channel}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Criada em {formatDate(campaign.created_at)}</span>
          </div>
          
          {campaign.scheduled_at && campaign.status === 'scheduled' && (
            <span className="text-xs text-blue-600 font-semibold">
              ⏰ Agendada: {formatDate(campaign.scheduled_at)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}