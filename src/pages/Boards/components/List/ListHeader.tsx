// src/pages/Boards/components/List/ListHeader.tsx
// 📝 HEADER DA LISTA - Título, contador, ações

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ListActions from './ListActions';
import type { BoardList } from '../../../../types/boards';

// ============================================
// TYPES
// ============================================

interface ListHeaderProps {
  list: BoardList;
  cardCount: number;
  onUpdate: (title: string) => void;
  onDelete: () => void;
  onArchive?: () => void;
  onDuplicate?: () => void;
  onMove?: () => void;
  onSort?: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ListHeader({
  list,
  cardCount,
  onUpdate,
  onDelete,
  onArchive,
  onDuplicate,
  onMove,
  onSort,
  isDragging = false,
  dragHandleProps,
}: ListHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      toast.error('Título não pode estar vazio');
      setTitle(list.title);
      setIsEditing(false);
      return;
    }

    if (trimmedTitle === list.title) {
      setIsEditing(false);
      return;
    }

    onUpdate(trimmedTitle);
    setIsEditing(false);
    toast.success('✅ Lista renomeada!');
  };

  const handleCancel = () => {
    setTitle(list.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`flex items-center gap-2 mb-4 ${isDragging ? 'opacity-50' : ''}`}>
      
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
      )}

      {/* Title - Editable */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              autoFocus
              maxLength={50}
              className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg font-bold text-gray-900 focus:outline-none text-sm"
            />
            <button
              onClick={handleSave}
              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
              title="Salvar"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              title="Cancelar"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <motion.button
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.02 }}
            className="w-full text-left"
          >
            <h3 className="font-bold text-gray-900 flex items-center gap-2 truncate group">
              <span className="flex-1 truncate">{list.title}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-semibold flex-shrink-0">
                {cardCount}
              </span>
            </h3>
          </motion.button>
        )}
      </div>

      {/* Actions Menu */}
      {!isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ListActions
            list={list}
            onEdit={() => setIsEditing(true)}
            onDelete={onDelete}
            onArchive={onArchive}
            onDuplicate={onDuplicate}
            onMove={onMove}
            onSort={onSort}
          />
        </div>
      )}
    </div>
  );
}