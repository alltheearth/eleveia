// src/components/common/Kanban/types.ts
/**
 * ============================================
 * KANBAN TYPES
 * ============================================
 * 
 * Tipos TypeScript para o componente Kanban
 */

import type { ReactNode } from 'react';

// ============================================
// CARD
// ============================================

export interface KanbanCard {
  id: string | number;
  title: string;
  description: string;
  columnId: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  assignedTo?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// COLUMN
// ============================================

export interface KanbanColumn {
  id: string;
  title: string;
  color: string; // Tailwind classes: bg-blue-100 text-blue-700
  icon?: ReactNode;
  cards: KanbanCard[];
  maxCards?: number; // Limite de cards na coluna
  isCollapsed?: boolean;
}

// ============================================
// CONFIG
// ============================================

export interface KanbanConfig {
  columns: KanbanColumn[];
  onCardMove: (cardId: string | number, fromColumnId: string, toColumnId: string) => void;
  onCardClick?: (card: KanbanCard) => void;
  renderCard?: (card: KanbanCard) => ReactNode;
  emptyColumnMessage?: string;
  allowDragAndDrop?: boolean;
}

// ============================================
// DRAG STATE
// ============================================

export interface DragState {
  draggedCardId: string | number | null;
  sourceColumnId: string | null;
  targetColumnId: string | null;
}

// ============================================
// CARD ACTIONS
// ============================================

export interface CardAction {
  label: string;
  icon?: ReactNode;
  onClick: (card: KanbanCard) => void;
  variant?: 'default' | 'danger' | 'success';
  show?: (card: KanbanCard) => boolean;
}