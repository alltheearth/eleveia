// src/pages/Boards/components/Board/BoardHeader.tsx
// 📋 HEADER DO BOARD - Título, descrição, ações

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  StarOff,
  MoreVertical,
  Settings,
  Archive,
  Users,
  Share2,
} from 'lucide-react';
import type { Board } from '../../../../types/boards';
import { BOARD_COLORS } from '../../../../constants/boards';

// ============================================
// TYPES
// ============================================

interface BoardHeaderProps {
  board: Board;
  onBack: () => void;
  onToggleStar?: () => void;
  onArchive?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  isStarred?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoardHeader({
  board,
  onBack,
  onToggleStar,
  onArchive,
  onSettings,
  onShare,
  isStarred = false,
}: BoardHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const colorConfig = BOARD_COLORS[board.color || 'blue'];

  return (
    <div className={`bg-gradient-to-r ${colorConfig.gradient} px-6 py-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Voltar para boards"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>

          {/* Board Info */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-sm text-white/80 line-clamp-1 max-w-xl">
                {board.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          
          {/* Star/Favorite Button */}
          {onToggleStar && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleStar}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={isStarred ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {isStarred ? (
                <StarOff className="text-white" size={20} fill="white" />
              ) : (
                <Star className="text-white" size={20} />
              )}
            </motion.button>
          )}

          {/* Share Button */}
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold backdrop-blur-sm"
            >
              <Users size={18} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          )}

          {/* More Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Mais opções"
            >
              <MoreVertical className="text-white" size={20} />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 min-w-[200px]"
              >
                {onSettings && (
                  <button
                    onClick={() => {
                      onSettings();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Configurações</span>
                  </button>
                )}
                
                {onShare && (
                  <button
                    onClick={() => {
                      onShare();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Share2 size={16} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Compartilhar</span>
                  </button>
                )}

                {onArchive && (
                  <>
                    <div className="border-t border-gray-200 my-2" />
                    <button
                      onClick={() => {
                        onArchive();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                    >
                      <Archive size={16} className="text-orange-600" />
                      <span className="text-sm font-semibold text-orange-600">Arquivar Board</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}