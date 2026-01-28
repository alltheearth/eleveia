// src/components/common/Kanban/KanbanCard.tsx
import { GripVertical } from 'lucide-react';
import type { KanbanCard as KanbanCardType } from './types';

/**
 * ============================================
 * KANBAN CARD COMPONENT
 * ============================================
 * 
 * Card individual do Kanban com drag & drop
 */

interface KanbanCardProps {
  card: KanbanCardType;
  isDragging: boolean;
  onClick?: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
  allowDragAndDrop?: boolean;
}

export default function KanbanCard({
  card,
  isDragging,
  onClick,
  onDragStart,
  onDragEnd,
  renderCard,
  allowDragAndDrop = true,
}: KanbanCardProps) {
  
  // ============================================
  // RENDER PERSONALIZADO
  // ============================================
  
  if (renderCard) {
    return (
      <div
        draggable={allowDragAndDrop}
        onDragStart={allowDragAndDrop ? onDragStart : undefined}
        onDragEnd={allowDragAndDrop ? onDragEnd : undefined}
        onClick={onClick}
        className={`
          group cursor-pointer transition-all
          ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
          ${allowDragAndDrop ? 'cursor-move' : 'cursor-pointer'}
        `}
      >
        {renderCard(card)}
      </div>
    );
  }

  // ============================================
  // RENDER PADRÃO
  // ============================================

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    urgent: 'border-l-red-500',
  };

  const priorityBadges = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div
      draggable={allowDragAndDrop}
      onDragStart={allowDragAndDrop ? onDragStart : undefined}
      onDragEnd={allowDragAndDrop ? onDragEnd : undefined}
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all
        hover:shadow-md group
        ${card.priority ? priorityColors[card.priority] : 'border-l-gray-300'}
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'opacity-100 scale-100'}
        ${allowDragAndDrop ? 'cursor-move' : 'cursor-pointer'}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        {allowDragAndDrop && (
          <GripVertical 
            size={16} 
            className="text-gray-400 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        )}
        
        <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 line-clamp-2">
          {card.title}
        </h4>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
        {card.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
        {/* Priority Badge */}
        {card.priority && (
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-semibold
            ${priorityBadges[card.priority]}
          `}>
            {card.priority === 'urgent' && '🔥'}
            {card.priority === 'high' && '⚠️'}
            {card.priority === 'medium' && '⚡'}
            {card.priority === 'low' && '📌'}
            {' '}
            {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
          </span>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {card.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                +{card.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Assigned To */}
        {card.assignedTo && (
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {card.assignedTo.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Due Date */}
      {card.dueDate && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            📅 {new Date(card.dueDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
        </div>
      )}
    </div>
  );
}