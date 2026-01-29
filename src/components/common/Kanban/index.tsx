// src/components/common/Kanban/index.tsx
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import type { KanbanConfig, DragState } from './types';

/**
 * ============================================
 * KANBAN BOARD COMPONENT
 * ============================================
 * 
 * Componente Kanban profissional com drag & drop
 * 
 * @example
 * ```tsx
 * <Kanban
 *   columns={[
 *     {
 *       id: 'new',
 *       title: 'Novo',
 *       color: 'bg-blue-100 text-blue-700',
 *       cards: [
 *         { id: 1, title: 'Card 1', description: 'Desc', columnId: 'new' }
 *       ]
 *     }
 *   ]}
 *   onCardMove={(cardId, from, to) => console.log('Moved', cardId)}
 *   onCardClick={(card) => console.log('Clicked', card)}
 * />
 * ```
 */
export default function Kanban({
  columns,
  onCardMove,
  onCardClick,
  renderCard,
  emptyColumnMessage,
  allowDragAndDrop = true,
  onAddCard,
}: KanbanConfig & { onAddCard?: (columnId: string) => void }) {
  
  // ============================================
  // STATE
  // ============================================
  
  const [dragState, setDragState] = useState<DragState>({
    draggedCardId: null,
    sourceColumnId: null,
    targetColumnId: null,
  });

  const [scrollPosition, setScrollPosition] = useState(0);

  // ============================================
  // DRAG HANDLERS
  // ============================================

  const handleCardDragStart = useCallback((cardId: string | number, columnId: string) => {
    setDragState({
      draggedCardId: cardId,
      sourceColumnId: columnId,
      targetColumnId: null,
    });
  }, []);

  const handleCardDragEnd = useCallback(() => {
    setDragState({
      draggedCardId: null,
      sourceColumnId: null,
      targetColumnId: null,
    });
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setDragState(prev => ({
      ...prev,
      targetColumnId: columnId,
    }));
  }, []);

  const handleColumnDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      targetColumnId: null,
    }));
  }, []);

  const handleColumnDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    const { draggedCardId, sourceColumnId } = dragState;

    if (!draggedCardId || !sourceColumnId) return;
    if (sourceColumnId === targetColumnId) {
      setDragState({
        draggedCardId: null,
        sourceColumnId: null,
        targetColumnId: null,
      });
      return;
    }

    // Check max cards
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (targetColumn?.maxCards && targetColumn.cards.length >= targetColumn.maxCards) {
      console.warn('Target column is full');
      setDragState({
        draggedCardId: null,
        sourceColumnId: null,
        targetColumnId: null,
      });
      return;
    }

    // Call callback
    onCardMove(draggedCardId, sourceColumnId, targetColumnId);

    // Reset state
    setDragState({
      draggedCardId: null,
      sourceColumnId: null,
      targetColumnId: null,
    });
  }, [dragState, columns, onCardMove]);

  // ============================================
  // SCROLL HANDLERS
  // ============================================

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('kanban-container');
    if (!container) return;

    const scrollAmount = 320; // Column width
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });

    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = true; // Simplificado

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {columns.length > 3 && (
        <>
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </>
      )}

      {/* Kanban Board */}
      <div
        id="kanban-container"
        className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ scrollbarWidth: 'thin' }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            isDragOver={dragState.targetColumnId === column.id}
            draggedCardId={dragState.draggedCardId}
            onDragOver={(e) => handleColumnDragOver(e, column.id)}
            onDragLeave={handleColumnDragLeave}
            onDrop={(e) => handleColumnDrop(e, column.id)}
            onCardDragStart={(cardId) => handleCardDragStart(cardId, column.id)}
            onCardDragEnd={handleCardDragEnd}
            onCardClick={onCardClick}
            onAddCard={onAddCard}
            renderCard={renderCard}
            emptyColumnMessage={emptyColumnMessage}
            allowDragAndDrop={allowDragAndDrop}
          />
        ))}
      </div>

      {/* Empty State */}
      {columns.length === 0 && (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 font-semibold mb-2">
              Nenhuma coluna configurada
            </p>
            <p className="text-sm text-gray-500">
              Configure as colunas do Kanban
            </p>
          </div>
        </div>
      )}
    </div>
  );
}