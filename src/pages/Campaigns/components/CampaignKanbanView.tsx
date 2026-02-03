// src/pages/Campaigns/components/CampaignKanbanView.tsx
// 📊 VISUALIZAÇÃO KANBAN DE CAMPANHAS - PROFISSIONAL E MODERNA

import { useMemo } from 'react';
import { Calendar, Users, Send, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Kanban from '../../../components/common/Kanban';
import { Badge } from '../../../components/common';
import type { Campaign, CampaignStatus } from '../../../types/campaigns/campaign.types';
import type { KanbanColumn, KanbanCard } from '../../../components/common/Kanban/types';
import { CAMPAIGN_STATUS_CONFIG, CHANNEL_CONFIG } from '../../../types/campaigns/campaign.types';

interface CampaignKanbanViewProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
  onChangeStatus: (cardId: number, fromStatus: string, toStatus: string) => void;
}

export default function CampaignKanbanView({
  campaigns,
  onCampaignClick,
  onChangeStatus,
}: CampaignKanbanViewProps) {
  
  // ============================================
  // CONFIGURAÇÃO DOS STATUS
  // ============================================
  
  const CAMPAIGN_STATUS_KANBAN = [
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
      title: 'Em Envio', 
      color: 'bg-yellow-100 text-yellow-700', 
      icon: <span className="text-2xl">🚀</span>,
      gradient: 'from-yellow-500 to-yellow-600',
    },
    { 
      id: 'completed', 
      title: 'Concluídas', 
      color: 'bg-green-100 text-green-700', 
      icon: <span className="text-2xl">✅</span>,
      gradient: 'from-green-500 to-green-600',
    },
    { 
      id: 'paused', 
      title: 'Pausadas', 
      color: 'bg-orange-100 text-orange-700', 
      icon: <span className="text-2xl">⏸️</span>,
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  // ============================================
  // TRANSFORMAR CAMPANHAS EM COLUNAS KANBAN
  // ============================================
  
  const kanbanColumns: KanbanColumn[] = useMemo(() => {
    return CAMPAIGN_STATUS_KANBAN.map(statusConfig => ({
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
            audience_count: campaign.audience_count,
            channels: campaign.channels,
            scheduled_at: campaign.scheduled_at,
            created_at: campaign.created_at,
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
    const { audience_count, channels, scheduled_at, created_at } = card.metadata || {};
    const statusConfig = CAMPAIGN_STATUS_KANBAN.find(s => s.id === card.columnId);

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        {/* Header do card */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-bold text-gray-900 text-sm line-clamp-2 flex-1">
            {card.title}
          </h4>
          {statusConfig && (
            <div className={`w-8 h-8 bg-gradient-to-br ${statusConfig.gradient} rounded-lg flex items-center justify-center flex-shrink-0 ml-2 shadow-md`}>
              <span className="text-white text-xs font-bold">
                {card.title.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
        
        {/* Informações */}
        <div className="space-y-2 mb-3">
          {/* Audiência */}
          {audience_count !== undefined && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 p-2 rounded-lg">
              <Users size={14} className="text-purple-600 flex-shrink-0" />
              <span className="font-semibold">{audience_count} pessoas</span>
            </div>
          )}
          
          {/* Canais */}
          {channels && channels.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {channels.map((channel: string) => {
                const config = CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG];
                return config ? (
                  <Badge key={channel} variant="blue" size="sm">
                    {config.icon} {config.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Footer do card */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {scheduled_at && (
            <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
              <Calendar size={12} />
              <span>
                {new Date(scheduled_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </span>
            </div>
          )}
          {created_at && !scheduled_at && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>
                {new Date(created_at).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </span>
            </div>
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
  // CALCULAR ESTATÍSTICAS
  // ============================================
  
  const totalAtivas = campaigns.filter(c => 
    c.status !== 'cancelled' && c.status !== 'failed'
  ).length;
  
  const taxaConversao = totalAtivas > 0 
    ? ((kanbanColumns.find(c => c.id === 'completed')?.cards.length || 0) / totalAtivas * 100).toFixed(1)
    : 0;

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="space-y-6">
      
      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-200 shadow-sm"
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          
          {/* Info principal */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                Pipeline de Campanhas
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {campaigns.length} campanhas
              </p>
            </div>
          </div>

          {/* Stats das colunas */}
          <div className="flex gap-6 flex-wrap">
            {kanbanColumns.map(col => {
              const config = CAMPAIGN_STATUS_KANBAN.find(s => s.id === col.id);
              const percentage = totalAtivas > 0 ? ((col.cards.length / totalAtivas) * 100).toFixed(0) : 0;
              
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

          {/* Taxa de conclusão */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <p className="text-xs text-gray-600 font-medium">Taxa de Conclusão</p>
              <p className="text-2xl font-bold text-green-600">{taxaConversao}%</p>
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