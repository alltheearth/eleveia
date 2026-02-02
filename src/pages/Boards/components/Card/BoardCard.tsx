    // src/pages/Boards/components/Card/BoardCard.tsx
// 🎴 COMPONENTE DE CARD INDIVIDUAL

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Clock,
  AlertCircle,
} from 'lucide-react';

// Types & Constants
import type { BoardCard } from '../../../../types/boards';
import { PRIORITY_CONFIG } from '../../../../constants/boards';

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
    <span className={`${color} text-white text-xs px-2 py-1 rounded font-semibold`}>
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

  const priorityConfig = card.priority ? PRIORITY_CONFIG[card.priority] : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cardDate = new Date(dateStr);
    cardDate.setHours(0, 0, 0, 0);

    const diffTime = cardDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let color = 'text-gray-600';
    let icon = <Calendar size={12} />;

    if (diffDays < 0) {
      color = 'text-red-600';
      icon = <AlertCircle size={12} />;
    } else if (diffDays === 0) {
      color = 'text-orange-600';
      icon = <Clock size={12} />;
    } else if (diffDays <= 3) {
      color = 'text-yellow-600';
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
  };

  const dueDate = card.due_date ? formatDate(card.due_date) : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 group relative"
    >
      {/* Priority Badge (top-right) */}
      {priorityConfig && (
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold ${priorityConfig.color}`}>
          {priorityConfig.icon}
        </div>
      )}

      {/* Title */}
      <h4 className="font-semibold text-gray-900 text-sm mb-2 pr-8 line-clamp-3">
        {card.title}
      </h4>

      {/* Description Preview */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.map((label, index) => (
            <Label key={index} name={label} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Due Date */}
        {dueDate && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${dueDate.color}`}>
            {dueDate.icon}
            <span>{dueDate.text}</span>
          </div>
        )}

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