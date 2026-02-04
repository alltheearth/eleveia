// src/pages/Boards/components/Board/BoardCard.tsx
// 🎴 COMPONENTE DE CARD - VERSÃO ULTRA-DEFENSIVA (100% À PROVA DE ERROS)

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  CheckSquare,
} from 'lucide-react';

// Types
import type { BoardCard, CardPriority } from '../../../../types/boards';

// ============================================
// CONFIGURAÇÃO DE PRIORIDADE LOCAL (SEMPRE DISPONÍVEL)
// ============================================
const PRIORITY_CONFIG_LOCAL: Record<string, { label: string; color: string; icon: string }> = {
  low: {
    label: 'Baixa',
    color: 'bg-gray-100 text-gray-700',
    icon: '⬇️',
  },
  medium: {
    label: 'Média',
    color: 'bg-yellow-100 text-yellow-700',
    icon: '➡️',
  },
  high: {
    label: 'Alta',
    color: 'bg-red-100 text-red-700',
    icon: '⬆️',
  },
  urgent: {
    label: 'Urgente',
    color: 'bg-red-500 text-white',
    icon: '🔴',
  },
};

// ============================================
// FUNÇÃO 100% SEGURA PARA PEGAR PRIORITY CONFIG
// ============================================
function getPriorityConfig(card: any): { label: string; color: string; icon: string } | null {
  // Verificação 1: card existe?
  if (!card) {
    console.warn('⚠️ Card é null ou undefined');
    return null;
  }

  // Verificação 2: card tem a propriedade priority?
  if (!('priority' in card)) {
    // Sem prioridade é OK, só retorna null
    return null;
  }

  // Verificação 3: priority tem valor?
  const priority = card.priority;
  if (!priority || typeof priority !== 'string') {
    // Priority vazio ou tipo errado
    return null;
  }

  // Verificação 4: priority existe no config local?
  if (!(priority in PRIORITY_CONFIG_LOCAL)) {
    console.warn('⚠️ Prioridade não encontrada:', priority);
    return null;
  }

  // Tudo OK! Retorna o config
  return PRIORITY_CONFIG_LOCAL[priority];
}

// ============================================
// LABEL COMPONENT
// ============================================

interface LabelProps {
  name: string;
}

function Label({ name }: LabelProps) {
  const colors: Record<string, string> = {
    'Urgente': 'bg-red-500',
    'Bug': 'bg-orange-500',
    'Feature': 'bg-blue-500',
    'Importante': 'bg-purple-500',
    'Aprovado': 'bg-green-500',
    'Em Revisão': 'bg-yellow-500',
    'Bloqueado': 'bg-gray-500',
    'Design': 'bg-pink-500',
  };

  const color = colors[name] || 'bg-gray-500';

  return (
    <span className={`${color} text-white text-xs px-2 py-1 rounded-md font-semibold shadow-sm`}>
      {name}
    </span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface BoardCardProps {
  card: BoardCard;
  onClick: () => void;
  onUpdate: (data: Partial<BoardCard>) => void;
  onDelete: () => void;
}

export default function BoardCardComponent({ 
  card, 
  onClick, 
  onUpdate, 
  onDelete 
}: BoardCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // ✅ USA A FUNÇÃO SUPER SEGURA - NUNCA VAI DAR ERRO
  const priorityConfig = getPriorityConfig(card);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cardDate = new Date(dateStr);
      cardDate.setHours(0, 0, 0, 0);

      const diffTime = cardDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let color = 'text-gray-600 bg-gray-100';
      let icon = <Calendar size={12} />;

      if (diffDays < 0) {
        color = 'text-red-700 bg-red-100';
        icon = <AlertCircle size={12} />;
      } else if (diffDays === 0) {
        color = 'text-orange-700 bg-orange-100';
        icon = <Clock size={12} />;
      } else if (diffDays <= 3) {
        color = 'text-yellow-700 bg-yellow-100';
        icon = <Calendar size={12} />;
      }

      return {
        text: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        color,
        icon,
        isOverdue: diffDays < 0,
        isToday: diffDays === 0,
        isSoon: diffDays > 0 && diffDays <= 3,
      };
    } catch (e) {
      console.warn('⚠️ Erro ao formatar data:', e);
      return null;
    }
  };

  const dueDate = card?.due_date ? formatDate(card.due_date) : null;

  // Mock data para features futuras
  const hasComments = false;
  const hasAttachments = false;
  const hasChecklist = false;
  const checklistProgress = 0;

  // Garantir que card existe
  if (!card) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 group relative"
    >
      {/* Priority Badge */}
      {priorityConfig && (
        <div className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold ${priorityConfig.color} shadow-md`}>
          {priorityConfig.icon}
        </div>
      )}

      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-sm mb-2 pr-6 line-clamp-3 leading-tight">
        {card.title || 'Sem título'}
      </h4>

      {/* Description */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels && Array.isArray(card.labels) && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.labels.slice(0, 3).map((label, index) => (
            <Label key={index} name={label} />
          ))}
          {card.labels.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md font-semibold">
              +{card.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          {/* Due Date */}
          {dueDate && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${dueDate.color}`}>
              {dueDate.icon}
              <span>{dueDate.text}</span>
            </div>
          )}

          {/* Comments */}
          {hasComments && (
            <div className="flex items-center gap-1 text-gray-500">
              <MessageSquare size={14} />
              <span className="text-xs font-semibold">3</span>
            </div>
          )}

          {/* Attachments */}
          {hasAttachments && (
            <div className="flex items-center gap-1 text-gray-500">
              <Paperclip size={14} />
              <span className="text-xs font-semibold">2</span>
            </div>
          )}

          {/* Checklist */}
          {hasChecklist && (
            <div className="flex items-center gap-1 text-gray-500">
              <CheckSquare size={14} />
              <span className="text-xs font-semibold">{checklistProgress}/5</span>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={14} className="text-gray-600" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[140px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left text-xs"
              >
                <Edit2 size={12} className="text-blue-600" />
                <span className="font-semibold text-gray-700">Abrir</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 transition-colors text-left text-xs"
              >
                <Trash2 size={12} className="text-red-600" />
                <span className="font-semibold text-red-600">Deletar</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}