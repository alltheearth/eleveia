// src/pages/Boards/components/Board/BoardCard.tsx
// 🎴 CARD DE BOARD - Para listagem de boards (NÃO confundir com cards do Kanban!)

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Calendar,
  TrendingUp,
  Archive,
} from 'lucide-react';
import type { Board } from '../../../../types/boards';

// ============================================
// CONFIGURAÇÃO DE CORES DOS BOARDS
// ============================================
const BOARD_COLORS: Record<string, { bg: string; gradient: string; text: string; ring: string }> = {
  blue: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    text: 'text-blue-600',
    ring: 'ring-blue-500',
  },
  purple: {
    bg: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
    ring: 'ring-purple-500',
  },
  green: {
    bg: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-600',
    ring: 'ring-green-500',
  },
  orange: {
    bg: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-600',
    ring: 'ring-orange-500',
  },
  pink: {
    bg: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600',
    text: 'text-pink-600',
    ring: 'ring-pink-500',
  },
  red: {
    bg: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    text: 'text-red-600',
    ring: 'ring-red-500',
  },
  gray: {
    bg: 'bg-gray-500',
    gradient: 'from-gray-500 to-gray-600',
    text: 'text-gray-600',
    ring: 'ring-gray-500',
  },
};

// ============================================
// TYPES
// ============================================
interface BoardCardProps {
  board: Board;
  onClick: (board: Board) => void;
  onEdit: (board: Board) => void;
  onDelete: (board: Board) => void;
  onToggleStar: (board: Board) => void;
  isStarred: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function BoardCard({
  board,
  onClick,
  onEdit,
  onDelete,
  onToggleStar,
  isStarred,
}: BoardCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Pega a configuração de cor do board
  const colorConfig = BOARD_COLORS[board.color || 'blue'];

  // Formata a data de criação
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      onClick={() => onClick(board)}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group relative"
    >
      {/* Header colorido */}
      <div className={`h-32 bg-gradient-to-br ${colorConfig.gradient} relative`}>
        {/* Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(board);
          }}
          className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all"
        >
          {isStarred ? (
            <Star size={18} className="text-white fill-white" />
          ) : (
            <Star size={18} className="text-white" />
          )}
        </button>

        {/* Archive Badge */}
        {board.is_archived && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
            <Archive size={12} />
            Arquivado
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {board.title}
        </h3>

        {/* Description */}
        {board.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {board.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Created Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} />
            <span>{formatDate(board.created_at)}</span>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 min-w-[160px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(board);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
                >
                  <TrendingUp size={14} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Abrir</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(board);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <Edit2 size={14} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Editar</span>
                </button>

                <div className="border-t border-gray-200 my-2" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(board);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 size={14} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Deletar</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Ring Effect */}
      <div className={`absolute inset-0 rounded-2xl ring-2 ${colorConfig.ring} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`} />
    </motion.div>
  );
}