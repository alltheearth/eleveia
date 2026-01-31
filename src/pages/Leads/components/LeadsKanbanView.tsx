// src/pages/Leads/components/LeadsKanbanView.tsx
// 📊 VISUALIZAÇÃO KANBAN DE LEADS - PROFISSIONAL E MODERNA

import { useMemo } from 'react';
import { Mail, Phone, Calendar, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Kanban from '../../../components/common/Kanban';
import { Badge } from '../../../components/common';
import type { Lead } from '../../../services';
import type { KanbanColumn, KanbanCard } from '../../../components/common/Kanban/types';

interface LeadsKanbanViewProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
  onChangeStatus: (cardId: number, fromStatus: string, toStatus: string) => void;
}

export default function LeadsKanbanView({
  leads,
  onLeadClick,
  onChangeStatus,
}: LeadsKanbanViewProps) {
  
  // ============================================
  // CONFIGURAÇÃO DOS STATUS
  // ============================================
  
  const LEAD_STATUS_CONFIG = [
    { 
      id: 'novo', 
      title: 'Novos', 
      color: 'bg-blue-100 text-blue-700', 
      icon: <span className="text-2xl">🆕</span>,
      gradient: 'from-blue-500 to-blue-600',
    },
    { 
      id: 'contato', 
      title: 'Em Contato', 
      color: 'bg-yellow-100 text-yellow-700', 
      icon: <span className="text-2xl">📞</span>,
      gradient: 'from-yellow-500 to-yellow-600',
    },
    { 
      id: 'qualificado', 
      title: 'Qualificados', 
      color: 'bg-purple-100 text-purple-700', 
      icon: <span className="text-2xl">⭐</span>,
      gradient: 'from-purple-500 to-purple-600',
    },
    { 
      id: 'conversao', 
      title: 'Convertidos', 
      color: 'bg-green-100 text-green-700', 
      icon: <span className="text-2xl">✅</span>,
      gradient: 'from-green-500 to-green-600',
    },
    { 
      id: 'perdido', 
      title: 'Perdidos', 
      color: 'bg-red-100 text-red-700', 
      icon: <span className="text-2xl">❌</span>,
      gradient: 'from-red-500 to-red-600',
    },
  ];

  // ============================================
  // TRANSFORMAR LEADS EM COLUNAS KANBAN
  // ============================================
  
  const kanbanColumns: KanbanColumn[] = useMemo(() => {
    return LEAD_STATUS_CONFIG.map(statusConfig => ({
      id: statusConfig.id,
      title: statusConfig.title,
      color: statusConfig.color,
      icon: statusConfig.icon,
      cards: leads
        .filter(lead => lead.status === statusConfig.id)
        .map(lead => ({
          id: lead.id,
          title: lead.nome,
          description: lead.observacoes || 'Sem observações',
          columnId: lead.status,
          metadata: {
            email: lead.email,
            telefone: lead.telefone,
            origem: lead.origem_display,
            criadoEm: lead.criado_em,
            lead: lead,
          },
        })),
    }));
  }, [leads]);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleCardMove = async (cardId: string | number, fromColumnId: string, toColumnId: string) => {
    onChangeStatus(Number(cardId), fromColumnId, toColumnId);
  };

  const handleCardClick = (card: KanbanCard) => {
    const lead = card.metadata?.lead as Lead;
    if (lead && onLeadClick) onLeadClick(lead);
  };

  // ============================================
  // RENDERIZAÇÃO CUSTOMIZADA DO CARD
  // ============================================
  
  const renderLeadCard = (card: KanbanCard) => {
    const { email, telefone, origem, criadoEm } = card.metadata || {};
    const statusConfig = LEAD_STATUS_CONFIG.find(s => s.id === card.columnId);

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
              <span className="text-white text-xs">
                {card.title.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
        
        {/* Informações de contato */}
        <div className="space-y-2 mb-3">
          {email && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {telefone && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Phone size={14} className="text-gray-400 flex-shrink-0" />
              <span>{telefone}</span>
            </div>
          )}
        </div>

        {/* Footer do card */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {origem && (
            <Badge variant="blue" size="sm">
              {origem}
            </Badge>
          )}
          {criadoEm && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>
                {new Date(criadoEm).toLocaleDateString('pt-BR', { 
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
  // CALCULAR ESTATÍSTICAS DO FUNIL
  // ============================================
  
  const totalAtivo = leads.filter(l => l.status !== 'perdido').length;
  const taxaConversao = totalAtivo > 0 
    ? ((kanbanColumns.find(c => c.id === 'conversao')?.cards.length || 0) / totalAtivo * 100).toFixed(1)
    : 0;

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
              <Target className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                Pipeline de Leads
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {leads.length} leads
              </p>
            </div>
          </div>

          {/* Stats das colunas */}
          <div className="flex gap-6 flex-wrap">
            {kanbanColumns.map(col => {
              const config = LEAD_STATUS_CONFIG.find(s => s.id === col.id);
              const percentage = totalAtivo > 0 ? ((col.cards.length / totalAtivo) * 100).toFixed(0) : 0;
              
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

          {/* Taxa de conversão */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <p className="text-xs text-gray-600 font-medium">Taxa de Conversão</p>
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
        renderCard={renderLeadCard}
        emptyColumnMessage="Nenhum lead neste status"
        allowDragAndDrop={true}
      />
    </div>
  );
}