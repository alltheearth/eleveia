// src/pages/Leads/components/LeadsKanbanView.tsx
import { useMemo } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
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
  
  // Configuração dos status
  const LEAD_STATUS_CONFIG = [
    { id: 'novo', title: 'New', color: 'bg-blue-100 text-blue-700', icon: <span>🆕</span> },
    { id: 'contato', title: 'In Contact', color: 'bg-yellow-100 text-yellow-700', icon: <span>📞</span> },
    { id: 'qualificado', title: 'Qualified', color: 'bg-purple-100 text-purple-700', icon: <span>⭐</span> },
    { id: 'conversao', title: 'Conversion', color: 'bg-green-100 text-green-700', icon: <span>✅</span> },
    { id: 'perdido', title: 'Lost', color: 'bg-red-100 text-red-700', icon: <span>❌</span> },
  ];

  // Transformar leads em colunas Kanban
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
          description: lead.observacoes || 'No notes',
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

  // Handler para movimento de cards
  const handleCardMove = async (cardId: string | number, fromColumnId: string, toColumnId: string) => {
    onChangeStatus(Number(cardId), fromColumnId, toColumnId);
  };

  // Handler para clique no card
  const handleCardClick = (card: KanbanCard) => {
    const lead = card.metadata?.lead as Lead;
    if (lead && onLeadClick) onLeadClick(lead);
  };

  // Renderização customizada do card
  const renderLeadCard = (card: KanbanCard) => {
    const { email, telefone, origem, criadoEm } = card.metadata || {};

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer">
        <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">{card.title}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
        
        <div className="space-y-2 mb-3">
          {email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {telefone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone size={14} className="text-gray-400 flex-shrink-0" />
              <span>{telefone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {origem && <Badge variant="blue" size="sm">{origem}</Badge>}
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
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Lead Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length} leads</p>
            </div>
          </div>
          <div className="flex gap-4">
            {kanbanColumns.map(col => (
              <div key={col.id} className="text-center">
                <p className="text-xs text-gray-600">{col.title}</p>
                <p className={`text-lg font-bold ${col.color.split(' ')[1]}`}>
                  {col.cards.length}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <Kanban
        columns={kanbanColumns}
        onCardMove={handleCardMove}
        onCardClick={handleCardClick}
        renderCard={renderLeadCard}
        emptyColumnMessage="No leads in this status"
        allowDragAndDrop={true}
      />
    </div>
  );
}