// src/pages/Campaigns/components/CampaignKanbanView.tsx
// 📊 VISUALIZAÇÃO KANBAN DE CAMPANHAS - PROFISSIONAL E MODERNA

import { useMemo } from 'react';
import { Calendar, Users, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Kanban from '../../../components/common/Kanban';
import { Badge } from '../../../components/common';
import type { Campaign, CampaignStatus } from '../../../types/campaigns/campaign.types';
import type { KanbanColumn, KanbanCard } from '../../../components/common/Kanban/types';

// ============================================
// TYPES
// ============================================

interface CampaignKanbanViewProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
  onChangeStatus: (campaignId: number, fromStatus: string, toStatus: string) => void;
}

// ============================================
// COMPONENT
// ============================================

export default function CampaignKanbanView({
  campaigns,
  onCampaignClick,
  onChangeStatus,
}: CampaignKanbanViewProps) {
  
  // ============================================
  // CONFIGURAÇÃO DOS STATUS
  // ============================================
  
  const CAMPAIGN_STATUS_CONFIG = [
    { 
      id: 'draft', 
      title: 'Rascunhos', 
      color: 'bg-gray-100 text-gray-700', 
      icon: <span className="text-2xl">📝</span>,
      gradient: 'from-gray-500 to-gray-600',
    },
    { 
      id: 'scheduled', 
      title: 'Agendadas', 
      color: 'bg-blue-100 text-blue-700', 
      icon: <span className="text-2xl">⏰</span>,
      gradient: 'from-blue-500 to-blue-600',
    },
    { 
      id: 'sending', 
      title: 'Enviando', 
      color: 'bg-yellow-100 text-yellow-700', 
      icon: <span className="text-2xl">🚀</span>,
      gradient: 'from-yellow-500 to-yellow-600',
    },
    { 
      id: 'sent', 
      title: 'Enviadas', 
      color: 'bg-green-100 text-green-700', 
      icon: <span className="text-2xl">✅</span>,
      gradient: 'from-green-500 to-green-600',
    },
    { 
      id: 'completed', 
      title: 'Concluídas', 
      color: 'bg-green-100 text-green-700', 
      icon: <span className="text-2xl">✅</span>,
      gradient: 'from-green-500 to-green-600',
    },
  ];

  const TYPE_ICONS: Record<string, string> = {
    matricula: '🎓',
    rematricula: '🔄',
    passei_direto: '🎉',
    reuniao: '📅',
    evento: '🎊',
    cobranca: '💰',
    comunicado: '📢',
  };

  const CHANNEL_ICONS: Record<string, string> = {
    whatsapp: '💬',
    email: '📧',
    sms: '📱',
  };

  // ============================================
  // TRANSFORMAR CAMPANHAS EM COLUNAS KANBAN
  // ============================================
  
  const kanbanColumns: KanbanColumn[] = useMemo(() => {
    return CAMPAIGN_STATUS_CONFIG.map(statusConfig => ({
      id: statusConfig.id,
      title: statusConfig.title,
      color: statusConfig.color,
      icon: statusConfig.icon,
      cards: campaigns
        .filter(campaign => campaign.status === statusConfig.id)
        .map(campaign => ({
          id: campaign.id,
          title: campaign.name,
          description: campaign.description || 'Sem descrição',
          columnId: campaign.status,
          metadata: {
            type: campaign.type,
            channels: campaign.channels,
            audience_count: campaign.audience_count,
            created_at: campaign.created_at,
            scheduled_at: campaign.scheduled_at,
            analytics: campaign.analytics,
            campaign: campaign,
          },
        })),
    }));
  }, [campaigns]);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleCardMove = async (cardId: string | number, fromColumnId: string, toColumnId: string) => {
    onChangeStatus(Number(cardId), fromColumnId, toColumnId);
  };

  const handleCardClick = (card: KanbanCard) => {
    const campaign = card.metadata?.campaign as Campaign;
    if (campaign && onCampaignClick) onCampaignClick(campaign);
  };

  // ============================================
  // RENDERIZAÇÃO CUSTOMIZADA DO CARD
  // ============================================
  
  const renderCampaignCard = (card: KanbanCard) => {
    const { 
      type, 
      channels, 
      audience_count, 
      created_at, 
      scheduled_at,
      analytics 
    } = card.metadata || {};
    
    const statusConfig = CAMPAIGN_STATUS_CONFIG.find(s => s.id === card.columnId);
    const typeIcon = TYPE_ICONS[type as string] || '📋';

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        {/* Header do card */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
              {card.title}
            </h4>
          </div>
          {statusConfig && (
            <div className={`w-10 h-10 bg-gradient-to-br ${statusConfig.gradient} rounded-lg flex items-center justify-center flex-shrink-0 ml-2 shadow-md`}>
              <span className="text-xl">{typeIcon}</span>
            </div>
          )}
        </div>

        {/* Descrição */}
        {card.description && card.description !== 'Sem descrição' && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {card.description}
          </p>
        )}
        
        {/* Métricas (se disponível) */}
        {analytics && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <Eye size={12} className="text-green-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-green-600">
                {analytics.open_rate.toFixed(0)}%
              </p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <MousePointerClick size={12} className="text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-blue-600">
                {analytics.click_rate.toFixed(0)}%
              </p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <TrendingUp size={12} className="text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-purple-600">
                {analytics.conversion_rate.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Audiência */}
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mb-3">
          <Users size={14} className="text-gray-400 flex-shrink-0" />
          <span className="font-semibold">{audience_count} contatos</span>
        </div>

        {/* Canais */}
        {channels && Array.isArray(channels) && (
          <div className="flex items-center gap-1 mb-3">
            {channels.map((channel: string) => (
              <span 
                key={channel}
                className="text-sm"
                title={channel}
              >
                {CHANNEL_ICONS[channel]}
              </span>
            ))}
          </div>
        )}

        {/* Footer do card */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {scheduled_at && card.columnId === 'scheduled' ? (
            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <Calendar size={12} />
              <span>{formatDate(scheduled_at)}</span>
            </div>
          ) : created_at ? (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{formatDate(created_at)}</span>
            </div>
          ) : null}
          
          {type && (
            <Badge variant="blue" size="sm">
              {type}
            </Badge>
          )}
        </div>

        {/* Hover indicator */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>
      </motion.div>
    );
  };

  // ============================================
  // CALCULAR ESTATÍSTICAS DO PIPELINE
  // ============================================
  
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => 
    ['scheduled', 'sending', 'sent'].includes(c.status)
  ).length;

  const avgOpenRate = campaigns
    .filter(c => c.analytics)
    .reduce((sum, c) => sum + (c.analytics?.open_rate || 0), 0) / 
    (campaigns.filter(c => c.analytics).length || 1);

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="space-y-6">
      
      {/* Stats Summary com visual melhorado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-200 shadow-sm"
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          
          {/* Info principal */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                Pipeline de Campanhas
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalCampaigns} campanhas
              </p>
            </div>
          </div>

          {/* Stats das colunas */}
          <div className="flex gap-6 flex-wrap">
            {kanbanColumns.map(col => {
              const config = CAMPAIGN_STATUS_CONFIG.find(s => s.id === col.id);
              const percentage = totalCampaigns > 0 
                ? ((col.cards.length / totalCampaigns) * 100).toFixed(0) 
                : 0;
              
              return (
                <div key={col.id} className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    {config?.icon}
                    <p className="text-xs text-gray-600 font-medium">{col.title}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-2xl font-bold ${col.color.split(' ')[1]}`}>
                      {col.cards.length}
                    </p>
                    <span className="text-xs text-gray-500">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Métricas agregadas */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Campanhas Ativas</p>
              <p className="text-2xl font-bold text-blue-600">{activeCampaigns}</p>
            </div>
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Taxa Abertura Média</p>
              <p className="text-2xl font-bold text-green-600">{avgOpenRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <Kanban
        columns={kanbanColumns}
        onCardMove={handleCardMove}
        onCardClick={handleCardClick}
        renderCard={renderCampaignCard}
        emptyColumnMessage="Nenhuma campanha neste status"
        allowDragAndDrop={true}
      />
    </div>
  );
}