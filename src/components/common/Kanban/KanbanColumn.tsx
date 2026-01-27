// src/components/common/Kanban/KanbanColumn.tsx
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';
import type { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from './types';

interface KanbanColumnProps {
  column: KanbanColumnType;
  isDragOver: boolean;
  draggedCardId: string | number | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onCardDragStart: (cardId: string | number) => void;
  onCardDragEnd: () => void;
  onCardClick?: (card: KanbanCardType) => void;
  onAddCard?: (columnId: string) => void;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
  emptyColumnMessage?: string;
  allowDragAndDrop?: boolean;
}

export default function KanbanColumn({
  column,
  isDragOver,
  draggedCardId,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
  onCardDragEnd,
  onCardClick,
  onAddCard,
  renderCard,
  emptyColumnMessage = 'Nenhum item nesta coluna',
  allowDragAndDrop = true,
}: KanbanColumnProps) {
  
  const cardCount = column.cards.length;
  const hasMaxCards = column.maxCards && cardCount >= column.maxCards;

  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-gray-100 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {column.icon}
            <h3 className="font-bold text-gray-900 text-lg">
              {column.title}
            </h3>
          </div>
          
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold
            ${column.color}
          `}>
            {cardCount}
          </div>
        </div>

        {/* Max cards indicator */}
        {column.maxCards && (
          <p className="text-xs text-gray-500">
            {cardCount} / {column.maxCards}
            {hasMaxCards && ' (máximo atingido)'}
          </p>
        )}

        {/* Add card button */}
        {onAddCard && !hasMaxCards && (
          <button
            onClick={() => onAddCard(column.id)}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-300 text-sm font-semibold"
          >
            <Plus size={16} />
            Adicionar
          </button>
        )}
      </div>

      {/* Cards Area */}
      <div
        onDragOver={allowDragAndDrop ? onDragOver : undefined}
        onDragLeave={allowDragAndDrop ? onDragLeave : undefined}
        onDrop={allowDragAndDrop ? onDrop : undefined}
        className={`
          flex-1 p-4 space-y-3 overflow-y-auto transition-all
          ${isDragOver && allowDragAndDrop ? 'bg-blue-50 border-2 border-dashed border-blue-400' : ''}
          ${hasMaxCards ? 'opacity-60' : ''}
        `}
        style={{ minHeight: '400px', maxHeight: '600px' }}
      >
        {/* Empty state */}
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm text-center">
              {emptyColumnMessage}
            </p>
          </div>
        )}

        {/* Cards */}
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            isDragging={draggedCardId === card.id}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
              onCardDragStart(card.id);
            }}
            onDragEnd={onCardDragEnd}
            renderCard={renderCard}
            allowDragAndDrop={allowDragAndDrop}
          />
        ))}
      </div>
    </div>
  );
}